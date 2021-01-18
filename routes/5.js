var express = require('express');
var router = express.Router();

// http://localhost:3000/5
router.get('/', function(req, res, next) {
    res.cookie("domain","hoge.com",{httpOnly: true})
    res.render('3rdPartyCookie', { title: '3rdPartyCookie'});
});

module.exports = router;
