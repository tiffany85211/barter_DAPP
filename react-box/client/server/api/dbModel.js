const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  itemID: String,
  lastSeen: String,
  likeList: [],
},{collection: 'Item'});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
