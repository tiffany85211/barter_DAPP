const apiFunc = require('./api');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(`${__dirname}/../public/index.html`);
});
router.post('/item', apiFunc.postItem);
router.get('/item/:id', apiFunc.getItem);
// router.get('/lastSeen/:id', apiFunc.getLastSeen);
// router.get('/likeList/:id', apiFunc.getLikeList);
// router.put('/lastSeen/:id', apiFunc.putLastSeen);
router.put('/likeList/:id', apiFunc.putLikeList);

module.exports = router;
