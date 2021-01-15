// node ./anotherServer/5/app.js
// http://localhost:3005/3rdPartyCookie.html

const express = require('express');
const app = express();
const path = require('path');

app.get('/3rd', function(req, res, next) {
    console.log("3rd")
    res.cookie("domain","3rd.com",{httpOnly: true})
    // res.cookie("domain","3rd.com")
});

app.listen(3005,() => console.log('Listeninig on port 3005...'));
