import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom"
import PlatformContract from "./contracts/Platform.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import "./App.css";

//Pages//
import HomePage from './components/HomePage'
import Match from './components/Match'
import NavBar from './components/NavBar'
import MyItems from './components/MyItems'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      web3: null, 
      accounts: null, 
      contract: null,
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const Contract = truffleContract(PlatformContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert( `Failed to load web3, accounts, or contract. Check console for details.`);
      console.log(error);
    }
  };

  render() {
    if(!this.state.web3) { return ( <div>Loading Web3...</div>); }
    const NavBarPage = (props) => { return ( <NavBar web3={this.state.web3} accounts={this.state.accounts} contract={this.state.contract} />); };
    const MyItemsPage = (props) => { return ( <MyItems  accounts={this.state.accounts} contract={this.state.contract} />); };
    const MatchPage = (props) => { return ( <Match  accounts={this.state.accounts} contract={this.state.contract} id={props.match.params.itemid}/>); };
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div className="App">
            <Route path='/barter' render={NavBarPage}/>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/barter/myitems' render={MyItemsPage} />
            <Route exact path="/barter/match:itemid" render={MatchPage} /> 
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
