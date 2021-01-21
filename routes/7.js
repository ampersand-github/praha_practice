var express = require('express');
var router = express.Router();



// http://localhost:3000/7/azisai.jpg
// http://localhost:3000/7/himawari.jpg


router.use(express.static('public/images/7/useCache', {
    setHeaders: (res, path, stat) => {
        res.cacheControl = {
            maxAge: 100,
            public:true
        };}
}));


router.use(express.static('public/images/7/notUseCache', {
    setHeaders: (res, path, stat) => {
        res.cacheControl = {
            noStore:true,
            maxAge:0
        };}
}));

module.exports = router;
