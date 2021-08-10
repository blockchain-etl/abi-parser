import React, { Component } from "react";
import Card from "react-bootstrap/Card";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export class ChainSelector extends Component {
  render() {
    return (
      <div>
        <Card className="m-3" style={{ width: 480 }} body>
          Select the Chain
          <DropdownButton
            title="Select Chain"
            variant="primary"
            onSelect={this.props.handleChainSubmit.bind(this)}
          >
            <Dropdown.Item eventKey="ethereum">Ethereum</Dropdown.Item>

            <Dropdown.Item eventKey="polygon">Polygon</Dropdown.Item>
          </DropdownButton>
          Chain: {this.props.chain}
        </Card>
      </div>
    );
  }
}

export default ChainSelector;
