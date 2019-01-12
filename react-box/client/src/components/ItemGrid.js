import React, { Component } from "react";
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

export default class MyItems extends Component {
    constructor(props) {
      super(props);
      this.state = { 
      };
    }
    
    render() {
        return (
          <div className="Item-Container">
            <div> Name: {this.props.item.name} </div>
            <div> Description: {this.props.item.description} </div>
            <Link to="/Match">
              <RaisedButton label="GO" style={{ margin: 12 }} />
            </Link>
            </div>
        );
      }


}