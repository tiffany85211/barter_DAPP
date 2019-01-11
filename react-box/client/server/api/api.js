const Item = require('./dbModel');

module.exports = {
  postItem(req, res) {
    Item.count({ itemID: req.body.itemID }, (err, count) => {
      if (count === 0) {
        console.log('create new item');
        Item.create({
          itemID: req.body.itemID,
          lastSeen: req.body.lastSeen,
          likeList: req.body.friendList,
        });
      }
    });
    console.log('postItem in server', req.body);
    Item.find({}, (err, item)=> console.log(item));
    res.json({ state: 'SUCCESS' });
  },

  getItem(req, res) {
    const id = req.params.id;
    Item.findOne({ itemID: id }, (err, item) => {
      if (err) console.log(err);
      res.json(item);
      console.log(`getItem ${id}: ${item}`);
    });
  },

  putLikeList(req, res) {
    const id = req.params.id;
    Item.findOne({ itemID: id }, (err, item) => {
      Item.findOneAndUpdate({ itemID: id }, { likeList: req.params.likeList })
          .catch(() => console.log(err));
    });
    res.json({ state: 'SUCCESS' });
  },

};
