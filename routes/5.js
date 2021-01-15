var express = require('express');
var router = express.Router();
const fs = require('fs');

// http://localhost:3000/5
router.get('/', function(req, res, next) {
    res.cookie("domain","hoge.com",{httpOnly: true})
    res.render('3rdPartyCookie', { title: '3rdPartyCookie'});
});
/*
router.get('/3rd', function(req, res, next) {
    console.log("3rd")
    res.cookie("domain","3rd.com",{httpOnly: true,domain:'http://localhost:3000'})
    // res.cookie("domain","3rd.com")
});
 */

module.exports = router;
