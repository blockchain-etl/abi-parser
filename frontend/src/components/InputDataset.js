import React, { Component } from 'react'

import Form from 'react-bootstrap/Form'
import Downloader from './Downloader'

export class InputDataset extends Component {
  render() {
    const { tables, contract, dataset, handleChangeDataset, handleDownloadAll } = this.props;
    return (
      <div>
        <Form onSubmit={handleDownloadAll.bind(this)}>
            <Form.Group>
              <Form.Label>Dataset Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter dataset name"
                value={dataset}
                onChange={handleChangeDataset.bind(this)}
              />
              <Form.Text>For Blockchain-ETL</Form.Text>
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
