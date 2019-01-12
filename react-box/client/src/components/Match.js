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
      accounts: this.props.accounts,
      contract: this.props.contract,
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentDidMount = async () => {
    try {
      var i;
      const allItems = [];
      const res = await this.state.contract.listUserItem();
        for(i = 0; i < res.length; i++) {
          var itemid = res[i].words[0];
          allItems.push(itemid);
        }
    } catch (error) {
      console.log(error);
    }
  };


  // const res = await this.state.contract.getItem(itemid);
  //         const showItem = {
  //           name: res[0].toString(),
  //           description: res[1].toString()
  //         };
  //         this.setState({ showItem });

  componentWillReceiveProps(nextProps) {
    this.setState({
      accounts: nextProps.accounts,  
      contract: nextProps.contract, 
      web3: nextProps.web3 
    });
  }

  handleLike() {

  };

  handleUnlike() {

  };

  render() {
      return (
        <div> 
          <Button onClick={this.handleLike}>Like</Button>
          <Button onClick={this.handleLike}>Nope</Button>
          <div>ID: {this.props.id} </div>
        </div>
      );
    }
}