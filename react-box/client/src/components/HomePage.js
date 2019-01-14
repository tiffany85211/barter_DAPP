import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Lottie from 'lottie-react-web'
import animation from './data.json'
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import '../css/style.css'

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});
class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {classes}=this.props;
    return (
      <div class = 'size'>
      <Lottie
      options={{
        animationData: animation
      }}
      height={{height:100}}
      />
      <div id='bm'></div>
        <Link to="/barter/myitems">
        <Fab variant="extended" aria-label="Delete" className={classes.fab}>
        <NavigationIcon className={classes.extendedIcon} />
        Start Now !
          </Fab>
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(Homepage);
