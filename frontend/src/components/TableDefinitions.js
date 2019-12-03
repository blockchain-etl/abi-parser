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
    } = this.props;
    return (
      <Card className="m-3" style={{ width: 480 }} body>
          <p>{`${Object.entries(queries).length} events found in contract ${contract.ContractName}:`}</p>
          <ol>{Object.entries(tables).map(obj => <li>{obj[0]}</li>)}</ol>
          <InputDataset
            tables={tables}
            contract={contract}
            dataset={dataset}
            handleChangeDataset={handleChangeDataset}
          />
        </Card>
    )
  }
}

export default TableDefinitions
