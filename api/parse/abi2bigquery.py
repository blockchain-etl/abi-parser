import json
import requests
from jinja2 import Template
from eth_utils import event_abi_to_log_topic
import argparse
from utils import read_abi_from_address 

SOLIDITY_TO_BQ_TYPES = {
  'address': 'STRING',
}

def s2bq_type(type):
  return SOLIDITY_TO_BQ_TYPES.get(type, 'STRING')

def read_abi_from_file(filepath):
  return json.loads(open(filepath).read())

def get_events_from_abi(abi):
  for a in abi:
    if a['type'] == 'event':
      yield a

def get_columns_from_event_abi(event_abi):
  return [a.get('name') for a in event_abi['inputs']]

def create_struct_fields_from_event_abi(event_abi):
  return ', '.join(['`' + a.get('name') + '` ' + s2bq_type(a.get('type')) for a in event_abi['inputs']])

def read_sql_template(filepath):
  return Template(open(filepath).read())

def event_to_sql(event_abi, template, contract_address):
  event_topic = '0x' + event_abi_to_log_topic(event_abi).hex()
  struct_fields = create_struct_fields_from_event_abi(event_abi)
  columns = get_columns_from_event_abi(event_abi)
  return template.render(
    abi=json.dumps(event_abi),
    contract_address=contract_address.lower(),
    event_topic=event_topic,
    struct_fields=struct_fields,
    columns=columns
  )

def contract_to_sqls(contract_address):
  result = {}
  abi = read_abi_from_address(contract_address)
  event_abis = get_events_from_abi(abi)
  tpl = read_sql_template('parse_logs.sql')
  for a in event_abis:
    result[a['name']] = event_to_sql(a, tpl, contract_address)
  return result

def main():
  parser = argparse.ArgumentParser(description='Get BigQuery log-parsing SQLs for contract address.')
  parser.add_argument('contract_address', help='Address of smart contract to parse')
  args = parser.parse_args()
  contract_address = args.contract_address
  print(contract_address)
  for event_name, sql in contract_to_sqls(contract_address).items():
    print()
    print(event_name)
    print()
    print(sql)

if __name__ == '__main__':
  main()
