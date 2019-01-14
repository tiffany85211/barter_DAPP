import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import '../css/style.css'

const styles = {
  card: {
    minWidth: 346,
    maxWidth: 346,
  },
  media: {
    height: 140,
  },
};

class MediaCard extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
      };
    }
    render() {
    const { classes, name, description } = this.props;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" class="googlefont">
           {name}
          </Typography>
          <Typography component="p" class="googlefont">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
}

export default withStyles(styles)(MediaCard);