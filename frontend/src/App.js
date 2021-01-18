import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Input from './components/Input';

import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import Query from './components/Query';
import TableDefinitions from './components/TableDefinitions';

const API_ENDPOINT = '/api/';
//const API_ENDPOINT = 'https://abi-parser.now.sh/api/'; // NOTE: use this when deploying to Firebase

const cardStyle = {
  width: 900
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      dataset: '',
      name: '',
      isLoading: false,
    }
  }

  handleChange(e) {
    this.setState({
      address: e.target.value
    })
  }

  handleChangeContractName(e) {
    this.setState({
      name: e.target.value 
    })
    const clone = JSON.parse(JSON.stringify(this.state.contract));
    clone.ContractName = e.target.value 
    this.setState({
      contract : clone
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
      isLoading: true,
    })
    await this.fetchData();
  }

  async fetchData() {
    const address = this.state.address;
    const queriesApi = `${API_ENDPOINT}queries/${address}`;
    const queriesRes = await fetch(queriesApi);
    const queries = await queriesRes.json()
    const tablesApi = `${API_ENDPOINT}tables/${address}`;
    const tablesRes = await fetch(tablesApi);
    const tables = await tablesRes.json()
    const contractApi = `${API_ENDPOINT}contract/${address}`;
    const contractRes = await fetch(contractApi);
    const contract = await contractRes.json()
    const name = contract.ContractName
    this.setState({
      name,
      queries,
      tables,
      contract,
      isLoading: false,
    })
  }

  render() {
    const { queries, tables, contract, address, dataset, name, isLoading} = this.state;
    return (
      <div className="App">
        <Input
          handleChange={this.handleChange.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          address={address}
          isLoading={isLoading}
          />
        {isLoading && <Card className="m-3" style={{width: 480}} body>
          <Spinner animation="border" />
        </Card>}
        {!isLoading && queries && <TableDefinitions
          tables={tables}
          contract={contract}
          queries={queries}
          cardStyle={cardStyle}
          dataset={dataset}
          name={name}
          handleChangeDataset={this.handleChangeDataset.bind(this)}
          handleChangeContractName={this.handleChangeContractName.bind(this)}
          />}
        {!isLoading && queries && tables &&
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
