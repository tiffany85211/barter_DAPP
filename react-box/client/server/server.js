const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const server = express();

server.use(bodyparser.json());
server.use(express.static(__dirname + '/../build'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', (err) => { console.log('connection error', err); });
db.once('open', () => { console.log('connected.'); });

const port = process.env.PORT || 3002;
server.listen(port, () => { console.log(`listening on ${port}...`); });


const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  id: String,
  lastSeen: String,
  likeList: [],
},{collection: 'Item'});

const Item = mongoose.model('Item', ItemSchema);

server.get('/api', (req, res) => {
  res.sendFile(`${__dirname}/../public/index.html`);
});

server.post('/api/item',(req, res) => {
  Item.countDocuments({ id: req.body.id }, (err, count) => {
    if (count === 0) {
      console.log('create new item');
      Item.create({
        id: req.body.id,
        lastSeen: req.body.lastSeen,
        likeList: req.body.friendList,
      });
    }
  });
  console.log('postItem in server', req.body);
  Item.find({}, (err, item)=> console.log(item));
  res.json({ state: 'SUCCESS' });
});

server.get('/api/item/:id', (req, res) => {
  const id = req.params.id;
  Item.findOne({ id: id }, (err, item) => {
    if (err) console.log(err);
    res.json(item);
    console.log(`getItem ${id}: ${item}`);
  });
});


server.put('/api/lastSeen/:id', (req, res) => {
  const id = req.params.id;
  var num;
  Item.findOne({ id: id }, (err, item) => {
    num = item.lastSeen;
    console.log('original last seen', num);
    num = req.body.lastSeen;
    console.log('new last seen', num);
    Item.findOneAndUpdate({ id: id }, { lastSeen: num })
        .catch(() => console.log(err));
  });
  res.json({ state: 'SUCCESS' });
});


server.put('/api/likeList/:id', (req, res) => {
  const id = req.params.id;
  let array = [];
  Item.findOne({ id: id }, (err, item) => {
    array = Array.from(item.likeList);
    console.log('original like list', array);
    var lid = req.body.likeID;
    array.push(lid);
    console.log('after like list', array);
    Item.findOneAndUpdate({ id: id }, { likeList: array })
        .catch(() => console.log(err));
  });
  res.json({ state: 'SUCCESS' });
});