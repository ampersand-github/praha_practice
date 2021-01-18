// node ./anotherServer/6/app.js

const cors = require('cors')
const express = require('express');
const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.post('/OK', cors(corsOptions),function(req, res, next) {
    console.log('http://localhost:3006へアクセス')
    res.send('aaaa')
    res.status(200).end();
});

app.post('/NG',function(req, res, next) {
    console.log('http://localhost:3006へアクセス')
});


app.post('/post', function(req, res, next) {
    console.log('別サーバー');
    console.log(req.body);
    const obj = {
        message: 'Hello from server!'
    };
    res.send(obj);
    res.status(200);

});

app.listen(3006, () => console.log('Listeninig on port 3006...'));
