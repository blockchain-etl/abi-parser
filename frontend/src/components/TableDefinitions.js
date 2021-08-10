import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import InputDataset from "./InputDataset";

export class TableDefinitions extends Component {
  render() {
    const {
      tables,
      contract,
      dataset,
      name,
      handleChangeDataset,
      handleChangeContractName,
    } = this.props;
    const events = Object.entries(tables).filter(
      (q) => q[1].parser.type === "log"
    );
    const functions = Object.entries(tables).filter(
      (q) => q[1].parser.type === "trace"
    );
    return (
      <Card className="m-3" style={{ width: 480 }} body>
        <p>{`${events.length} events found in contract ${contract.ContractName}:`}</p>
        <ol>
          {events.map((obj) => (
            <li>{obj[0]}</li>
          ))}
        </ol>
        <p>{`${functions.length} functions found in contract ${contract.ContractName}:`}</p>
        <ol>
          {functions.map((obj) => (
            <li>{obj[0]}</li>
          ))}
        </ol>
        <InputDataset
          tables={tables}
          contract={contract}
          dataset={dataset}
          name={name}
          handleChangeContractName={handleChangeContractName}
          handleChangeDataset={handleChangeDataset}
        />
      </Card>
    );
  }
}

export default TableDefinitions;
