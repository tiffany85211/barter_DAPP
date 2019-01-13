import React, { Component } from "react";
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';
import addons from 'react-addons';
import Hammer from 'hammerjs';
import merge from 'merge';
import './style.css'
import Button from '@material-ui/core/Button';

var Card = createReactClass({
  getInitialState: function() {
      return {
          initialPosition: {
              x: 0,
              y: 0
          }
      };
  },

  setInitialPosition: function() {
      var screen = document.getElementById('root'),
          card = ReactDOM.findDOMNode(this),

          initialPosition = {
              x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
              y: Math.round((screen.offsetHeight+600 - card.offsetHeight) / 2)
          };

      this.setState({
          initialPosition: initialPosition
      });
  },

  componentDidMount: function() {
      this.setInitialPosition();

      window.addEventListener('resize', this.setInitialPosition);
  },

  componentWillUnmount: function() {
      window.removeEventListener('resize', this.setInitialPosition);
  },

  render: function() {
      var initialTranslate = ''.concat(
          'translate3d(',
          this.state.initialPosition.x + 'px,',
          this.state.initialPosition.y + 'px,',
          '0px)'
      );

      var style = merge({
          msTransform: initialTranslate,
          WebkitTransform: initialTranslate,
          transform: initialTranslate,
          zIndex: this.props.index,
          backgroundImage:this.props.image,
          // backgroundImage: 'url("./image/' + this.props.image + '")'
      }, this.props.style);

      var classes = addons.classSet(merge(
          {
              card: true
          },
          this.props.classes
      ));

      return (
              <div style={style} className={classes}>
              <h1>{this.props.title}</h1>
              <p>{this.props.text}</p>
              <img src={'./image/'+this.props.image}></img>
              </div>
      );
  }
});

var DraggableCard = createReactClass({
  getInitialState: function() {
      return {
          x: 0,
          y: 0,
          initialPosition: {
              x: 0,
              y: 0
          },
          startPosition: {
              x: 0,
              y: 0
          },
          animation: null
      };
  },

  resetPosition: function() {
      var screen = document.getElementById('root'),
          card = ReactDOM.findDOMNode(this);

      var initialPosition = {
          x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
          y: Math.round((screen.offsetHeight+600 - card.offsetHeight) / 2)
      };

      var initialState = this.getInitialState();
      this.setState(
          {
              x: initialPosition.x,
              y: initialPosition.y,
              initialPosition: initialPosition,
              startPosition: initialState.startPosition
          }
      );
  },

  panHandlers: {
      panstart: function() {
          this.setState({
              animation: false,
              startPosition: {
                  x: this.state.x,
                  y: this.state.y
              }
          });
      },
      panend: function(ev) {
          var screen = document.getElementById('root'),
              card = ReactDOM.findDOMNode(this);

          if (this.state.x < -50) {
              this.props.onOutScreenLeft(this.props.cardId);
          } else if ((this.state.x + (card.offsetWidth - 50)) > screen.offsetWidth) {
              this.props.onOutScreenRight(this.props.cardId);
          } else {
              this.resetPosition();
              this.setState({
                  animation: true
              });
          }
      },
      panmove: function(ev) {
          this.setState(this.calculatePosition(
              ev.deltaX, ev.deltaY
          ));
      },
      pancancel: function(ev) {
          console.log(ev.type);
      }
  },

  handlePan: function(ev) {
      ev.preventDefault();
      this.panHandlers[ev.type].call(this, ev);
      return false;
  },

  handleSwipe: function(ev) {
      console.log(ev.type);
  },

  calculatePosition: function(deltaX, deltaY) {
      return {
          x: (this.state.initialPosition.x + deltaX),
          y: (this.state.initialPosition.y + deltaY)
      };
  },

  componentDidMount: function() {
      this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
      this.hammer.add(new Hammer.Pan({threshold: 0}));

      var events = [
          ['panstart panend pancancel panmove', this.handlePan],
          ['swipestart swipeend swipecancel swipemove',
           this.handleSwipe]
      ];

      events.forEach(function(data) {
          if (data[0] && data[1]) {
              this.hammer.on(data[0], data[1]);
          }
      }, this);

      this.resetPosition();
      window.addEventListener('resize', this.resetPosition);
  },

  componentWillUnmount: function() {
this.hammer.stop();
this.hammer.destroy();
this.hammer = null;

      window.removeEventListener('resize', this.resetPosition);
  },

  render: function() {
      var translate = ''.concat(
          'translate3d(',
          this.state.x + 'px,',
          this.state.y + 'px,',
          '0px)'
      );

      var style = {
          msTransform: translate,
          WebkitTransform: translate,
          transform: translate
      };

      var classes = {
          animate: this.state.animation
      };

      return (<Card {...this.props}
              style={style}
              classes={classes}></Card>);
  }
});

var Swipe = createReactClass({
  getInitialState: function() {
      return {
          cards: this.props.initialCardsData,
          alertLeft: false,
          alertRight: false
      };
  },

  removeCard: function(side, cardId) {
      setTimeout(function(){
          if (side === 'left') {
              this.setState({alertLeft: false});
          } else if (side === 'right') {
              this.setState({alertRight: false});
          }
      }.bind(this), 3000);

      this.setState({
          cards: this.state.cards.filter(function(c) {
              return c.id !== cardId;
          }),
          alertLeft: side === 'left',
          alertRight: side === 'right'
      });
  },

  render: function() {
      var cards = this.state.cards.map(function(c, index, coll) {
          var props = {
              cardId: c.id,
              index: index,
              onOutScreenLeft: this.removeCard.bind(this, 'left'),
              onOutScreenRight: this.removeCard.bind(this, 'right'),
              title: c.title,
              text: c.text,
              image: c.image
          };

          var component = (index === (coll.length - 1)) ?
                  DraggableCard:
                  Card;

          return React.createElement(component, props);
      }, this);

      var classesAlertLeft = addons.classSet({
          'alert-visible': this.state.alertLeft,
          'alert-left': true,
          'alert': true
      });
      var classesAlertRight = addons.classSet({
          'alert-visible': this.state.alertRight,
          'alert-right': true,
          'alert': true
      });

      return (
          <div>
            <div id="cards">
                  {cards}
            </div>
            <div className={classesAlertLeft}>Nope</div>
            <div className={classesAlertRight}>Like</div>
          </div>
      );
  }
});

var data = [
{title: 'test', text: 'test', id: '1', image:"1.jpg"},
{title: 'test2', text: 'test', id: '2', image: '2.jpg'}
];

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
        console.log("THIS IS A MATCH!");
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
          <Swipe initialCardsData={data}/>
          <Button onClick={this.handleLike}>Like</Button>
          <Button onClick={this.handleUnlike}>Nope</Button>
          <div>myID: {this.props.id} </div>
          <div>name: {this.state.showItem.name}</div>
          <div>description: {this.state.showItem.description}</div>
          <div>lastSeen: {this.state.lastSeen} </div>
        </div>
      );
    }
}