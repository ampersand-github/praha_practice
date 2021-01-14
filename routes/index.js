var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// 「/about」のルーティング設定
router.get("/about", (req, res) => {
  res.status(200).send("aboutページ");
});

router.get('/hw', (req, res) => {
  res.render('helloWorld', { title: 'Express' });
});
module.exports = router;
