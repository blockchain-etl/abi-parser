import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Input from './components/Input';

import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Query from './components/Query';
import TableDefinitions from './components/TableDefinitions';

const API_ENDPOINT = '/api/';

const cardStyle = {
  width: 900
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      dataset: '',
      isLoading: false,
    }
  }

  handleChange(e) {
    this.setState({
      address: e.target.value
    })
  }

  handleChangeDataset(e) {
    this.setState({
      dataset: e.target.value
    })
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({
      isLoading: !this.state.isLoading
    })
    await this.fetchData();
  }

  async fetchData() {
    const { address } = this.state;
    const queriesApi = `${API_ENDPOINT}queries/${address}`;
    const queriesRes = await fetch(queriesApi);
    const queries = await queriesRes.json()
    const tablesApi = `${API_ENDPOINT}tables/${address}`;
    const tablesRes = await fetch(tablesApi);
    const tables = await tablesRes.json()
    const contractApi = `${API_ENDPOINT}contract/${address}`;
    const contractRes = await fetch(contractApi);
    const contract = await contractRes.json()
    this.setState({
      queries,
      tables,
      contract,
      isLoading: false,
    })
  }

  render() {
    const { queries, tables, contract, address, dataset, isLoading} = this.state;
    return (
      <div className="App">
        <Input
          handleChange={this.handleChange.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          address={address}
          isLoading={isLoading}
          />
        {isLoading && <Card className="m-3" style={cardStyle} body>
          <Spinner animation="border" />
        </Card>}
        {!isLoading && queries && <TableDefinitions
          tables={tables}
          contract={contract}
          queries={queries}
          cardStyle={cardStyle}
          dataset={dataset}
          handleChangeDataset={this.handleChangeDataset.bind(this)}
          />}
        {!isLoading && queries &&
          Object.entries(queries).map(obj => <Query
            title={obj[0]}
            query={obj[1]}
            key={obj[0]}
            table={tables[obj[0]]}
          ></Query>)}
      </div>
    );
  }
}

export default App;
