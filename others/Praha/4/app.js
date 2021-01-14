// app.jsを右クリック->実行
// http://localhost:3004/

const express = require('express')
const app = express()
const port = 3004


app.get('/', (req, res) => {
    console.log('Hello World!');
    res.send('Hello World!')
})

// 課題1
// GETリクエスト受けた時、{text: hello world}とjsonをHTTPステータス200で返してください
// http://localhost:3004/4-1
// curl http://localhost:3004/4-1 -H "Content-Type: application/json"
app.get('/4-1', function(req, res, next) {
    res.send('{text: hello world}');
    res.status(200).end();
    console.log(res.statusCode)
});

// 課題2
// localhost:8080に対してPOSTリクエストを受けた時、リクエストbodyに含まれるjsonデータを、レスポンスのbodyに含めて、HTTPステータス201で返してください
// POSTリクエストを受け付けるエンドポイントは、Content-Typeがapplication/json以外の時は、HTTPステータス400を返してください
// 	curl http://localhost:3004/4-2 -d '{"name": "hoge"}' -H "Content-Type: application/json"
// 	curl http://localhost:3004/4-2 -d '{"name": "hoge"}'

app.get('/4-2', function(req, res, next) {

    res.send('{text: hello world}');
    if (req.is('application/json')) {
        // res.send(req.body);
        // res.status(201).end();
        res.status(201).json(req.body).end();
    } else {
        res.status(400).end();
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
