import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default class MyItems extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        storageValue: 0,
        open: false,
        name: '',
        description: '',
        multiline: 'Controlled',
        items: [],
        web3: null, 
        accounts: null, 
        contract: null,
      };
      this.handleAddItem = this.handleAddItem.bind(this);
      this.handleClickAddItem = this.handleClickAddItem.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }

    handleAddItem() {
      const items = this.state.items.slice();
      const newItem = {
        name       : this.state.name,
        description: this.state.description,
        changeId   : 0, 
        status     : 0
      };
      items.push(newItem);
      this.setState({ items, open: false });
    }

    handleClickAddItem() {
      this.setState({ open: true });
    }

    handleClose() {
      this.setState({ open: false });
    };
  
    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };

    componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const Contract = truffleContract(SimpleStorageContract);
        Contract.setProvider(web3.currentProvider);
        const instance = await Contract.deployed();
  
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance }, this.runExample);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.log(error);
      }
    };
  
    runExample = async () => {
      const { accounts, contract } = this.state;
  
      // Stores a given value, 5 by default.
      await contract.set(5, { from: accounts[0] });
  
      // Get the value from the contract to prove it worked.
      const response = await contract.get();
  
      // Update state with the result.
      this.setState({ storageValue: response.toNumber() });
    };
  
    render() {

      if (!this.state.web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
      }
      return (
        <div className="App">
        <div>state: {this.state.open.toString()} </div>
          <div className="add-item">
            <FloatingActionButton onClick={this.handleClickAddItem}>
              <ContentAdd />
            </FloatingActionButton>
          </div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Upload an item</DialogTitle>
            <DialogContent>
              <DialogContentText>Please upload your item!</DialogContentText>
              <TextField
                id="outlined-name"
                label="Name"
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                value={this.state.description}
                onChange={this.handleChange('description')}
                rows="4"
                margin="normal"
                variant="filled"
              />
            </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">Cancel</Button>
            <Button onClick={this.handleAddItem} color="primary">Add Item</Button>
          </DialogActions>
        </Dialog>

          <div>The stored value is: {this.state.storageValue}</div>
        </div>
      );
    }
  }
