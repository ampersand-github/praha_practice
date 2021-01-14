var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
// git remote add origin git@github.com:ampersand-github/praha_practice
// git push -u origin mian
