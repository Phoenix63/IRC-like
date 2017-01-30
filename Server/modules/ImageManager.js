
var shortid = require('shortid');
var fs      = require('fs');
var config  = require('./../config.json');

var ImageManager = (function() {
    function ImageManager(socket) {
        this.socket = socket;

        this.socket.on('image', (function(data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                this.socket.send('{"err": "invalid image", "image": "'+data+'"}');
                throw "invalid image received";
            }
            if(data.type === 'png') {
                var base64Data = data.image.replace(/^data:image\/png;base64,/, "");
                var img_path = this.socket.client.id+"_"+shortid.generate()+".png";
                fs.writeFile("images/"+img_path, base64Data, 'base64', (function() {
                    this.socket.logger._RECEIVE_IMAGE('http://'+config.ip+':'+config.image_server.port+'/img/'+img_path);
                    this.socket.send('I got your image :)! check http://'+config.ip+':'+config.image_server.port+'/img/'+img_path);
                }).bind(this));
            }
        }).bind(this));
    }

    return ImageManager;
})();


module.exports = ImageManager;