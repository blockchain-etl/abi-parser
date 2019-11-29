from __future__ import print_function
import json
import os

from utils import read_abi_from_address 

parser_type = 'log'
dataset_name = '<INSERT_DATASET_NAME>'
table_prefix = '<TABLE_PREFIX>'
table_description = '<INSERT TABLE DESCRIPTION>'

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

def main():
  contract_address = '0x9ae49c0d7f8f9ef4b864e004fe86ac8294e20950'
  filepath = f'abis/{dataset_name}/{table_prefix}.json'
  abi = read_abi_from_address(contract_address)
  for a in abi:
    if a['type'] == 'event':
      os.makedirs(os.path.join(output_folder, dataset_name), exist_ok=True)
      output_filepath = os.path.join(output_folder, dataset_name, create_table_name(a) + '.json')
      td = abi_to_table_definition(a, contract_address)
      f = open(output_filepath, 'w')
      f.write(json.dumps(td, indent=4))
      f.close()

if __name__ == '__main__':
  main()
