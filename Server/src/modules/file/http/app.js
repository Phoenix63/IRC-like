let express = require('express');
let config = require('./../../../config.json');
let app = express();
let path = require('path');

app.use('/public', express.static('./__uploaded_files__/'));

app.get('/', (req, res, next) => {
    res.end('PandIrc File Server');
});

app.listen(config.image_server.port, () => {
    console.log(' - File server running -');
});