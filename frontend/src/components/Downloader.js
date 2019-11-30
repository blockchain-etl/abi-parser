import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import multiDownload from 'multi-download'

export class Downloader extends Component {

  render() {
    const { tables, contract } = this.props;
    return (
      <div>
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            multiDownload(
              Object.entries(tables).map(
                obj => URL.createObjectURL(
                  new Blob(
                    [JSON.stringify(obj[1], null, 4)],
                    {type: 'application/json'}
                    )
                  )
              ),
              {
                rename: ({url, index, urls}) => Object.entries(tables)[index][0] + '.json'
              }
            );
          }}
        >Download Table Definitions</Button>
      </div>
    )
  }
}

export default Downloader
