import React, { Component } from "react";

import Button from '@material-ui/core/Button';

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      itemid: this.props.itemid,
      accounts: this.props.accounts,
      contract: this.props.contract,
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accounts: nextProps.accounts,  
      contract: nextProps.contract, 
      web3: nextProps.web3 
    });
  }


  render() {
      return (
        <div> 
          <Button onClick={this.handleLike}>Like</Button>
          <Button onClick={this.handleLike}>Nope</Button>
          <div>ID: {this.props.itemid} </div>
        </div>
      );
    }
}