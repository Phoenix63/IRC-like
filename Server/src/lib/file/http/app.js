let express = require('express');
let config = require('./../../../config.json');
let app = express();
let path = require('path');
let debug = require('debug')('pandirc:fileserver:app');
let mime = require('mime');
let fs = require('fs');


app.use('/public/:arg', function(req, res) {

    if(fs.existsSync('__uploaded_files__/'+req.params.arg)) {
        let file =  '__uploaded_files__/'+req.params.arg;

        let filename = path.basename(file);
        let mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        let filestream = fs.createReadStream(file);
        filestream.pipe(res);
    } else {
        res.end('404 - Not found!');
    }

});

app.get('/', (req, res, next) => {
    res.end('PandIrc File Server');
});

app.listen(config.image_server.port, () => {
    debug(' - File server running -');
});