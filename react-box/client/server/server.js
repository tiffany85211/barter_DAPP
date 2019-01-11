const express = require('express');
const bodyparser = require('body-parser');
const router = require('./api/route');
const mongoose = require('mongoose');

const server = express();

server.use(bodyparser.json());
server.use(express.static(__dirname + '/../build'));
server.use('/api', router);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/barter-dapp', { useNewUrlParser: true });
console.log(`MONGODB_URI = ${process.env.MONGODB_URI}`);

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('connection error', err);
});
db.once('open', () => {
  console.log('connected.');
//   console.log(db.collection())
});

const port = process.env.PORT || 3002;
server.listen(port, () => { console.log(`listening on ${port}...`); });
