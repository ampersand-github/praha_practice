// node ./anotherServer/5/app.js
// http://localhost:3005/3rdPartyCookie.html
// 参考 -> https://stackoverflow.com/questions/14343556/express-js-attach-cookie-to-statically-served-content

// これが別オリジンのサーバーの代わり
// ngrokでngrok http 3005して、得たドメイン名を使う。

const express = require('express');
const app = express();


app.use(express.static(__dirname, {
    setHeaders: function (res) {
        res.cookie('3rdPartyCookie', 'aaa')
    }
}));

app.listen(3005,() => console.log('Listeninig on port 3005...'));
