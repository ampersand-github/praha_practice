var express = require('express');
var router = express.Router();

// '課題6 CORSについて理解する'
// http://localhost:3000/6
router.get('/', function(req, res, next) {
    res.render('cors', { title: '課題6 CORSについて理解する'});
});

router.post('/1', (req, res) => {
    console.log('/test1');
    console.log(req.body);
    const obj = {
        message: 'Hello from server!'
    };
    res.send(obj);
    res.status(200);

});

module.exports = router;
