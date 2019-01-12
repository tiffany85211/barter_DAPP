import React, { Component } from "react";
import { BrowserRouter, Route } from 'react-router-dom';

import Button from '@material-ui/core/Button';


export default class MyItems extends Component {
    redirectToTarget = () => {
      this.props.history.push(`/match`);
    }
    
    render() {
        return (
          <div className="Item-Container">
            <div> Name: {this.props.item._name} </div>
            <div> Description: {this.props.item._description} </div>
            {this.renderRedirect()}
              <Button onClick={this.redirectToTarget}>GO</Button>
            </div>
        );
      }


}