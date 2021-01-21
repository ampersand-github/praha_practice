
var path = require('path');
var express = require('express');
var router = express.Router();


// http://localhost:3000/7/himawari
// http://localhost:3000/7/himawari.jpg
// http://localhost:3000/images/dog.jpg




/*
// router.disable('etag');
router.use(express.static('public/images/7', {
    etag: false,
    maxAge:31557600000,
 /*
    setHeaders: (res, path, stat) => {
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.removeHeader('ETag');
        res.header('Cache-Control', ['private', 'no-store', 'no-cache', 'must-revalidate', 'proxy-revalidate'].join(','));
        res.header('no-cache', 'Set-Cookie');    },


}))
 */


router.use(express.static('public/images/7'));

router.get('/himawari', function(req, res, next) {
    console.log('7')
    console.log(__dirname);
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", '100000000');
    res.render('practice', { title: 'Practice',description: 'ここは練習ページです。'});

});

router.get('/azisai', function(req, res, next) {
    console.log('7')
    console.log(__dirname);
    res.cacheControl = {
        maxAge: 15552000,
        public:true
    };
    res.send('<img src="azisai.jpg" alt="azisai">');

});


/*
router.use(express.static('../public/images', {
    setHeaders: function (res) {
        res.cookie('3rdPartyCookie', 'bbb')
    }
}));

 */
module.exports = router;
