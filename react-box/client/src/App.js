import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Route, Switch, Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import MyItems from './MyItems';

import "./App.css";

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const renderHomePage = () => {
      return(
        <div>
          <Link to="/myitems" onClick={this.forceUpdate}>
            <RaisedButton label="START" style={{ margin: 12 }} />
          </Link>
        </div>
      )
    }
    return (
      <MuiThemeProvider>
      <div className="App">
        <Switch>
          <Route exact path="/" component={renderHomePage} />
          <Route exact path="/myitems" component={MyItems} />
        </Switch>
      </div>
    </MuiThemeProvider>
    );
  }
}

export default App;
