import React, { Component } from "react";
import ItemGrid from './ItemGrid';
import ButtonBases from './ButtonPage'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './style.css'
import ButtonPage from "./ButtonPage";

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
  
});

class MyItems extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        open: false,
        name: '',
        description: '',
        items: [],
        accounts: this.props.accounts,
        contract: this.props.contract,
      };
      this.handleClickAddItem = this.handleClickAddItem.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount = async () => {
      try {
        const items = [];
        var i;
        const myItemList = await this.state.contract.listUserItem({from: this.state.accounts[0]});
          for(i = 0; i < myItemList.length; i++) {
            var itemid = myItemList[i].words[0];
            const res = await this.state.contract.getItem(itemid.toString(), {from: this.state.accounts[0]});
            const newItem = {
              id: itemid.toString(),
              name: res[0].toString(),
              description: res[1].toString()
            };
            console.log("did mount: ", res[0].toString());
            items.push(newItem);
          }
          this.setState({ items });
      } catch (error) {
        console.log(error);
      }
    };

    componentWillReceiveProps(nextProps) {
      this.setState({
        accounts: nextProps.accounts,  
        contract: nextProps.contract, 
      });
    }


    handleAddItem = async () => {
        await this.state.contract.newItem(this.state.name, this.state.description, {from: this.state.accounts[0] });
        const items = this.state.items.slice();;
        const myItemList = await this.state.contract.listUserItem({from: this.state.accounts[0]});
        console.log(myItemList);
        var i; var maxid = 0;
        for(i = 0; i < myItemList.length; i++) {
          var itemid = myItemList[i].words[0];
          if(itemid > maxid) { maxid = itemid; }
        }
        const res = await this.state.contract.getItem(maxid.toString(), {from: this.state.accounts[0]});
        const newItem = {
          id: maxid.toString(),
          name: res[0].toString(),
          description: res[1].toString()
        };
        items.push(newItem);
        this.setState({ items });
        this.setState({ name: '', description: '', open: false });

        await fetch('/api/item', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: maxid.toString(),
            lastSeen: "0",
            likeList: []
          }),
        })
        .then(res => console.log(res.status))
        .catch((err) => { console.log('fetch post item error', err); });
    }

    handleClickAddItem() {
      this.setState({ open: true });
    }

    handleClose() {
      this.setState({ open: false, name: '', description: '' });
    };
  
    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };

    renderItem(i) {
      return (
        <div class='ItemList'>
        <ItemGrid key={i} id={i} item={this.state.items[i]} />
        </div>
      );
    }

    render() {
      const {classes}=this.props;
      return (
        <div className="App">
          <div className="add-item marginAUTO" onClick={this.handleClickAddItem}>
            <ButtonPage></ButtonPage>
          </div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Upload an item</DialogTitle>
            <DialogContent>
              <DialogContentText>Please upload your item!</DialogContentText>
              <div>
              <TextField
                id="outlined-name"
                label="Name"
                value={this.state.name}
                onChange={this.handleChange('name')}
                margin="normal"
                variant="outlined"
              /></div>
              <div>
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                value={this.state.description}
                onChange={this.handleChange('description')}
                rows="4"
                margin="normal"
                variant="filled"
              /></div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color='#d81313'>Cancel</Button>
              <Button onClick={this.handleAddItem} color="primary">Add Item</Button>
            </DialogActions>
          </Dialog>
          <div>
            <ul className="item-list" class="Flex">
              {this.state.items.map((item, i) => this.renderItem(i))}
            </ul>
            {/* <div> Items size: {this.state.items.length}</div> */}
          </div>
        </div>
      );
    }
  }

  export default withStyles(styles)(MyItems);