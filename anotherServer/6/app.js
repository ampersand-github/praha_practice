// node ./anotherServer/6/app.js
// ngrok http 3066
const express = require('express');
const app = express();
// https://s8a.jp/node-js-express-http-options#http%E3%81%AEoptions%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%81%A8%E3%81%AF

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    //res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Max-Age', '1');
    next()
});

app.options('*', function (req, res) {
    console.log('options')
    res.sendStatus(200);
});


app.post('/simple',function(req, res, next) {
    console.log('simpleへアクセス')
    res.send('simpleへアクセス成功')
    res.status(200).end();
});

app.post('/preflight',function(req, res, next) {
    console.log('preflightへアクセス')
    res.send('preflightへアクセス成功')
    res.status(200).end();
});


app.listen(3066, () => console.log('Listeninig on port 3066...'));
