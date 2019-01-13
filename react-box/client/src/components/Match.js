import React, { Component } from "react";

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      showItem: {},
      allItems: [],
      lastSeen: 0,
      end: false,
      accounts: this.props.accounts,
      contract: this.props.contract,
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleUnlike = this.handleUnlike.bind(this);
  }

  componentDidMount = async () => {
    try {
      await fetch(`/api/item/${this.props.id}`)
        .then(res => res.json())
        .then(item => { this.setState({ lastSeen: parseInt(item.lastSeen), likeList: item.likeList }); })
        .catch((err) => { console.log('fetch get item error', err); });
      var i;
      const allItems = [];
      const res = await this.state.contract.listMatchItems({from: this.state.accounts[0]});
      for(i = 0; i < res.length; i++) {
        var itemid = res[i].words[0];
        if(itemid === 0) { break; }
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
    const resItem = await this.state.contract.getItem(this.state.allItems[this.state.lastSeen], {from: this.state.accounts[0]});
    const showItem = {
      name: resItem[0].toString(),
      description: resItem[1].toString()
    };
    const lastSeen = this.state.lastSeen + 1;
    this.setState({ showItem, lastSeen });
  }

  handleLike  = async () => {
    var showItemlikeList = [];
    var i;
    var matched = false;

    await fetch(`/api/item/${this.state.allItems[this.state.lastSeen - 1]}`)
      .then(res => res.json())
      .then(item => { showItemlikeList = item.likeList; })
      .catch((err) => { console.log('fetch get match item error', err); });
    
    for(i = 0; i < showItemlikeList.length; i++) {
      if(showItemlikeList[i].toString() === this.props.id.toString()) {
        console.log("THIS IS A MATCH!");
        await this.state.contract.changeItem(
          this.props.id.toString(), this.state.allItems[this.state.lastSeen - 1].toString(), 
          {from: this.state.accounts[0] }); 
        
        matched = true;
      }
    }
    var likeID = this.state.allItems[this.state.lastSeen - 1];

    if(!matched) {
      await fetch(`/api/likeList/${this.props.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          likeID: likeID
        }),
      })
      .then(res => res.status)
      .catch((err) => { console.log('fetch put likeList error', err); });
    }

    await fetch(`/api/lastSeen/${this.props.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastSeen: this.state.lastSeen.toString(),
      }),
    })
    .then(res => res.status)
    .catch((err) => { console.log('fetch put lastSeen error', err); });
    
    this.getNextItem();
  };

  handleUnlike = async () => {
    await fetch(`/api/lastSeen/${this.props.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastSeen: this.state.lastSeen.toString(),
      }),
    })
    .then(res => console.log(res.status))
    .catch((err) => { console.log('fetch put lastSeen error', err); });

    this.getNextItem();
  };

  render() {
      if(this.state.end) { return(<div> END!!! </div>); }
      return (
        <div> 
          <div>myID: {this.props.id} </div>
          <div>name: {this.state.showItem.name}</div>
          <div>description: {this.state.showItem.description}</div>
          <div>lastSeen: {this.state.lastSeen} </div>
        </div>
      );
    }
}