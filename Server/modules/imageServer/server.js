var config = require('./../../config.json');
var express = require('express');
var path = require('path');
var app = express();

app.use('/img', express.static(path.join(__dirname, '../../images')));

app.get('/', function(req, res) {
    res.end('bonjour :)!');
});

app.listen(config.image_server.port);