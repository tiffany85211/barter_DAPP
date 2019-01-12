import React, { Component } from "react";

import Button from '@material-ui/core/Button';

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      allItems: [],
      showItem: {},
      lastSeen: 0,
      likeList: [],
      end: false,
      accounts: this.props.accounts,
      contract: this.props.contract,
    };
    // this.handleLike = this.handleLike.bind(this);
    // this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentDidMount = async () => {
    try {
      var i;
      const allItems = [];
      const res = await this.state.contract.listMatchItems({from: this.state.accounts[0]});
      for(i = 0; i < res.length; i++) {
        var itemid = res[i].words[0];
        console.log(itemid);
        if(itemid == 0) { break; }
        allItems.push(itemid);
      }
      this.setState({ allItems }, this.getNextItem);
    } catch (error) {
      console.log(error);
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      accounts: nextProps.accounts,  
      contract: nextProps.contract, 
      web3: nextProps.web3 
    });
  }

  getNextItem = async () => {
    if(this.state.lastSeen === this.state.allItems.length) { this.setState({ end: true }); return; };
    const resItem = await this.state.contract.getItem(this.state.allItems[this.state.lastSeen].toString(), {from: this.state.accounts[0]});
    const showItem = {
      name: resItem[0].toString(),
      description: resItem[1].toString()
    };
    const lastSeen = this.state.lastSeen + 1;
    this.setState({ showItem, lastSeen });
  }

  handleLike  = async () => {
    this.getNextItem();
  };

  handleUnlike = async () => {
    this.getNextItem();

  };

  render() {
      if(this.state.end) { return(<div> END!!! </div>); }
      return (
        <div> 
          <Button onClick={this.handleLike}>Like</Button>
          <Button onClick={this.handleUnlike}>Nope</Button>
          <div>myID: {this.props.id} </div>
          <div>name: {this.state.showItem.name}</div>
          <div>description: {this.state.showItem.description}</div>
        </div>
      );
    }
}