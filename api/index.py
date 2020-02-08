from requests import get
from jinja2 import Template
from eth_utils import event_abi_to_log_topic
from json import loads, dumps
from flask import Flask, jsonify
from flask_cors import CORS

PORT = 3000
ETHERSCAN_API_KEY = '6H8VRTDHJVS6II983YY3DN8NCVBBHDA3MX' # should be env var, but whatever
SOLIDITY_TO_BQ_TYPES = {
  'address': 'STRING',
}
TEMPLATE = '''
CREATE TEMP FUNCTION
  PARSE_LOG(data STRING, topics ARRAY<STRING>)
  RETURNS STRUCT<{{struct_fields}}>
  LANGUAGE js AS """
    var parsedEvent = {{abi}}
    return abi.decodeEvent(parsedEvent, data, topics, false);
"""
OPTIONS
  ( library="https://storage.googleapis.com/ethlab-183014.appspot.com/ethjs-abi.js" );

WITH parsed_logs AS
(SELECT
    logs.block_timestamp AS block_timestamp
    ,logs.block_number AS block_number
    ,logs.transaction_hash AS transaction_hash
    ,logs.log_index AS log_index
    ,PARSE_LOG(logs.data, logs.topics) AS parsed
FROM `bigquery-public-data.crypto_ethereum.logs` AS logs
WHERE address = '{{contract_address}}'
  AND topics[SAFE_OFFSET(0)] = '{{event_topic}}'
)
SELECT
     block_timestamp
     ,block_number
     ,transaction_hash
     ,log_index{% for column in columns %}
    ,parsed.{{ column }} AS `{{ column }}`{% endfor %}
FROM parsed_logs
'''

app = Flask(__name__)
CORS(app)

parser_type = 'log'
dataset_name = '<INSERT_DATASET_NAME>'
table_prefix = '<TABLE_PREFIX>'
table_description = ''

### UTILS
def read_abi_from_address(address):
  a = address.lower()
  k = ETHERSCAN_API_KEY
  url = f'https://api.etherscan.io/api?module=contract&action=getabi&address={a}&apikey={k}'
  json_response = get(url).json()
  return loads(json_response['result'])

def read_contract_from_address(address):
  a = address.lower()
  k = ETHERSCAN_API_KEY
  url = f'https://api.etherscan.io/api?module=contract&action=getsourcecode&address={a}&apikey={k}'
  json_response = get(url).json()
  contract = [x for x in json_response['result'] if 'ContractName' in x][0]
  return contract

def create_table_name(abi):
  return table_prefix + '_event_' + abi['name']

def abi_to_table_definition(abi, contract_address):
  table_name = create_table_name(abi)
  result = {}
  result['parser'] = {
    'type': parser_type,
    'contract_address': contract_address,
    'abi': abi,
    'field_mapping': {}
  }
  result['table'] = {
    'dataset_name': dataset_name,
    'table_name': table_name,
    'table_description': table_description,
    'schema': [
        {
            'name': x.get('name'),
            'description': '',
            'type': 'STRING' # we sometimes get parsing errors, so safest to make all STRING
        } for x in abi['inputs']
    ]
  }
  return result

def contract_to_table_definitions(contract_address):
  abi = read_abi_from_address(contract_address)
  results = {}
  for a in abi:
    if a['type'] == 'event':
      event_name = (a['name'])
      results[event_name] = abi_to_table_definition(a, contract_address)
  return results


def s2bq_type(type):
  return SOLIDITY_TO_BQ_TYPES.get(type, 'STRING')

def get_events_from_abi(abi):
  for a in abi:
    if a['type'] == 'event':
      yield a

def get_columns_from_event_abi(event_abi):
  return [a.get('name') for a in event_abi['inputs']]

def create_struct_fields_from_event_abi(event_abi):
  return ', '.join(['`' + a.get('name') + '` ' + s2bq_type(a.get('type')) for a in event_abi['inputs']])

def event_to_sql(event_abi, template, contract_address):
  event_topic = '0x' + event_abi_to_log_topic(event_abi).hex()
  struct_fields = create_struct_fields_from_event_abi(event_abi)
  columns = get_columns_from_event_abi(event_abi)
  return template.render(
    abi=dumps(event_abi),
    contract_address=contract_address.lower(),
    event_topic=event_topic,
    struct_fields=struct_fields,
    columns=columns
  )

def contract_to_sqls(contract_address):
  result = {}
  abi = read_abi_from_address(contract_address)
  event_abis = get_events_from_abi(abi)
  tpl = Template(TEMPLATE)
  for a in event_abis:
    result[a['name']] = event_to_sql(a, tpl, contract_address)
  return result

### WEB SERVER

@app.route('/api/')
def index():
    return jsonify({'status': 'alive'})

@app.route('/api/test')
def test():
    return jsonify({'status': 'test'})


@app.route('/api/queries/<contract>')
def queries(contract):
    queries = contract_to_sqls(contract)
    return jsonify(queries)

@app.route('/api/tables/<contract>')
def tables(contract):
    tables = contract_to_table_definitions(contract)
    return jsonify(tables)

@app.route('/api/contract/<contract>')
def contract(contract):
    c = read_contract_from_address(contract)
    return jsonify(c)

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=PORT)
