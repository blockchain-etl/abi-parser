import React, { Component } from 'react'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export class Input extends Component {

  render() {
    return (
      <div>
        <Card className="m-3" style={{ width: 450 }} body>
          <Form onSubmit={this.props.handleSubmit.bind(this)}>
            <Form.Group>
              <Form.Label>Generate SQL for Ethereum Events</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter contract address"
                value={this.props.address}
                onChange={this.props.handleChange.bind(this)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Input
