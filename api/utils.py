"""Utility functions for ABIs parsing."""
import requests
import json

ETHERSCAN_API_KEY = 'YourApiKeyToken'

def read_abi_from_address(address):
  a = address.lower()
  k = ETHERSCAN_API_KEY
  url = f'https://api.etherscan.io/api?module=contract&action=getabi&address={a}&apikey={k}'
  json_response = requests.get(url).json()
  return json.loads(json_response['result'])
