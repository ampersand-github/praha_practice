var express = require('express');
var router = express.Router();

// 練習
// http://localhost:3000/practice
router.get('/', function(req, res, next) {
    res.render('practice', { title: 'Practice',description: 'ここは練習ページです。'});
});

router.get('/index', function(req, res, next) {
    console.log('index')
    res.render('index', { title: 'Practice'});
    res.status(200);
});

router.get('/index2', function(req, res, next) {
    console.log('index')
    res.send('{text: hello world}');
    res.status(200);
});
router.post('/post1', function(req, res, next) {
    console.log('post1')
    console.log(req.body);
    console.log('user agent: ' + req.header('User-Agent'));
    console.log(req.headers);
    res.send('POST request to the homepage');
});
// よくわからないがスーパーリロードしないと反映されない
router.get('/cookie', function(req, res, next) {
    console.log('cookie')
    res.cookie('foo', 'bar', {
        domain:'localhost:3000/practice',
        path:'/cookie',
        maxAge: 300,
        httpOnly: true,
        secure:true
    })
    res.send('{text: hello world}');
    res.status(200);
});
module.exports = router;
