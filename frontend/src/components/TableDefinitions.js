import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
import TableLink from './TableLink';
import InputDataset from './InputDataset';

export class TableDefinitions extends Component {
  render() {
    const {
      tables,
      contract,
      queries,
      dataset,
      handleChangeDataset,
      handleDownloadAll,
    } = this.props;
    return (
      <Card className="m-3" style={{ width: 450 }} body>
          <p>{`${Object.entries(queries).length} events found in contract ${contract.ContractName}:`}</p>
          <ol>
            {Object.entries(tables).map(obj => <li>
              <TableLink
                title={obj[0]}
                table={obj[1]}
              />
            </li>)
            }
          </ol>
          <InputDataset
            tables={tables}
            contract={contract}
            dataset={dataset}
            handleChangeDataset={handleChangeDataset}
            handleDownloadAll={handleDownloadAll}
          />
        </Card>
    )
  }
}

export default TableDefinitions
