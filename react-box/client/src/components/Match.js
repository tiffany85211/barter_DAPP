import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MediaCard from './MediaCard'
import './style.css'

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isMatchOpen: false,
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

  handleClose = () => {
    this.setState({ isMatchOpen: false });
  };

  getNextItem = async () => {
    console.log("lastseen:", this.state.lastSeen);
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
    var showItemlikeList = [];
    var i;
    var matched = false;

    await fetch(`/api/item/${this.state.allItems[this.state.lastSeen - 1]}`)
      .then(res => res.json())
      .then(item => { showItemlikeList = item.likeList; })
      .catch((err) => { console.log('fetch get match item error', err); });
    
    for(i = 0; i < showItemlikeList.length; i++) {
      if(showItemlikeList[i].toString() === this.props.id.toString()) {
        this.setState({ isMatchOpen: true });
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
  handleClose = () => {
    this.setState({ isMatchOpen: false });
  };
  render() {
      if(this.state.end && !this.state.isMatchOpen) { 
          return(<div> 
            <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '5%', fontFamily: "Lucida Console", color: 'white'  }} >
            <p class="googlefont"> This is the end of our BarterChain! </p>
            </div>
            <div  style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '2%' }} >
                <MediaCard  name="No More Match!" description="" />
            </div>
          </div>
        );}
      return (
        <div> 
          <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '5%', fontFamily: "Lucida Console", color: 'white'  }} >
            <p class="googlefont"> I want to exchange my item with: </p>
          </div>
          <div  style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '2%' }} >
            <MediaCard  name={this.state.showItem.name} description={this.state.showItem.description} />
          </div>
          <div style={{minHeight: '300px'}}>
            <Button style={{width: '173px', heigth:'100%', backgroundColor: '#FFF0F0'}}  onClick={this.handleUnlike}>Nope</Button>
            <Button style={{width: '173px', heigth:'100%', backgroundColor:'#8DC884'}}  onClick={this.handleLike}>Like</Button>
          </div>
          <div>
            <Dialog
              open={this.state.isMatchOpen}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"YOU HAVE A MATCH!!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Your Match Item: {this.state.showItem.name}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      );
    }
}
