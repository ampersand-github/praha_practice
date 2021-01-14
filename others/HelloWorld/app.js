//  node ./HelloWorld/app.js
// http://localhost:3004/

const express = require('express')
const app = express()
const port = 3004

app.get('/', (req, res) => {
    //console.log(req.header('Content-Type'));
    res.send('Hello World!')
})

// 「/about」のルーティング設定
app.get("/about", (req, res) => {
    res.status(200).send("aboutページ");
});

// helloWorld.htmlページを開く
app.get('/hw', (req, res) => {
    res.sendFile(__dirname + '/helloWorld.html');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
