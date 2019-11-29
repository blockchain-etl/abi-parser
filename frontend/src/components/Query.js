import React, { Component } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export class Query extends Component {
  render() {
    const { title, query, table } = this.props;
    const tableData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(table, null, 4));
    return (
      <div>
        <Card className="m-3" style={{ width: 900 }}>
          <Card.Header as="h5">
            {title}
          </Card.Header>
          <Card.Body>
            <pre><code>{query}</code></pre>
            <Button
              variant="secondary"
              href={`data: ${tableData}`}
              download={`${title}.json`}
            >Download Table Definition
            </Button>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default Query
