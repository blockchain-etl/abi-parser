import React, { Component } from "react";

export class TableLink extends Component {
  render() {
    const { title, table } = this.props;
    const tableData =
      "text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(table, null, 4));
    return (
      <a href={`data: ${tableData}`} download={`${title}.json`}>
        {title}
      </a>
    );
  }
}

export default TableLink;
