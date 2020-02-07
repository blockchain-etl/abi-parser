import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import multiDownload from 'multi-download'

export class Downloader extends Component {

  render() {
    const { tables, contract, dataset } = this.props;
    const { ContractName } = contract;
    return (
      <div>
        <Button
          variant="success"
          type="submit"
          onClick={() => {
            let parserTypeToFileName = {
                'log': '_event_',
                'trace': '_call_'
            };
            multiDownload(
                Object.entries(tables).map(obj => {
                const tableName = ContractName + parserTypeToFileName[obj[1].parser.type] + obj[0];
                obj[1].table.dataset_name = dataset;
                obj[1].table.table_name = tableName;
                return URL.createObjectURL(
                  new Blob([JSON.stringify(obj[1], null, 4)], {type: 'application/json'})
                )
                }
              ),
              {
                rename: ({url, index, urls}) => ContractName + parserTypeToFileName[Object.entries(tables)[index][1].parser.type] + Object.entries(tables)[index][0] + '.json'
              }
            );
          }}
        >Download Table Definitions</Button>
      </div>
    )
  }
}

export default Downloader
