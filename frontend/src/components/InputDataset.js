import React, { Component } from 'react'

import Form from 'react-bootstrap/Form'
import Downloader from './Downloader'

export class InputDataset extends Component {
  render() {
    const { tables, contract, dataset, handleChangeDataset } = this.props;
    return (
      <div>
        <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Label>Dataset Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter dataset name"
                value={dataset}
                onChange={handleChangeDataset.bind(this)}
                required
              />
              <Form.Text>
                For <a
                  href="https://github.com/blockchain-etl/ethereum-etl-airflow"
                  rel="noopener"
                  target="_blank"
                >Blockchain-ETL</a>
              </Form.Text>
            </Form.Group>
            <Downloader
              tables={tables}
              contract={contract}
              dataset={dataset}
              />
          </Form>
      </div>
    )
  }
}

export default InputDataset;
