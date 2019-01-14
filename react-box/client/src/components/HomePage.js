import React, { Component } from "react";
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
// import Lottie from 'lottie-react-web';
// import animation from 'https://labs.nearpod.com/bodymovin/demo/markus/halloween/markus.json'

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        {/* <Lottie
        options={{
          animationData: 'https://labs.nearpod.com/bodymovin/demo/markus/halloween/markus.json'
        }}/> */}
        <Link to="/barter/myitems">
          <RaisedButton label="START" style={{ margin: 12 }} />
        </Link>
      </div>
    );
  }
}

export default Homepage;
