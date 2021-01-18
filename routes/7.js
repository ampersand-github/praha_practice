var express = require('express');
var router = express.Router();

// http://localhost:3000/7/dog
// http://localhost:3000/images/dog.jpg
router.get('/dog', function(req, res, next) {
    console.log('7')
    console.log(__dirname);
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", '100000000');
    res.render('practice', { title: 'Practice',description: 'ここは練習ページです。'});

});

router.get('/dog2', function(req, res, next) {
    console.log('7')
    console.log(__dirname);
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", '100000000');
    res.send('<img src="/images/dog.jpg" alt="dog">').header("Cache-Control", "no-cache, no-store, must-revalidate");

});


/*
router.use(express.static('../public/images', {
    setHeaders: function (res) {
        res.cookie('3rdPartyCookie', 'bbb')
    }
}));

 */
module.exports = router;
