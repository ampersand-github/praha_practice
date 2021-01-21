var express = require('express');
var router = express.Router();

// '課題6 CORSについて理解する'
// http://localhost:3000/6
router.get('/', function(req, res, next) {
    res.render('cors', { title: '課題6 CORSについて理解する'});
});


module.exports = router;
