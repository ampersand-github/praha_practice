// node ./anotherServer/6/server.js
// http://localhost:3006/cors1.html

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname)));
app.listen(3006, () => console.log('Listeninig on port 3006...'));
