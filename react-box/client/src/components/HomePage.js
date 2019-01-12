import React, { Component } from "react";
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';


class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log(this.state.web3);
    return (
      <div>
        <Link to="/barter/myitems">
          <RaisedButton label="START" style={{ margin: 12 }} />
        </Link>
      </div>
    );
  }
}

export default Homepage;
