var express = require('express');
var router = express.Router();


// http://localhost:3000/6
router.get('/', function(req, res, next) {
    res.render('index', { title: '課題6 CORSについて理解する' });
});

router.get('/1', function(req, res, next) {
    console.log('/test1');
    console.log(req.body);
    const obj = {
        message: 'Hello from server!'
    };
    res.status(200).json(obj);
});
module.exports = router;

// node ./anotherServer/5/app.js
// 
