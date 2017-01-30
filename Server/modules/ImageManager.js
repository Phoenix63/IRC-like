
var shortid = require('shortid');
var fs      = require('fs');
var config  = require('./../config.json');

format = [
    'png',
    'jpeg',
    'jpg'
];

var ImageManager = (function() {
    function ImageManager(socket) {
        this.socket = socket;

        this.image = '';

        this.receiveTimeout = null;

        this.socket.on('image', (function(data) {

            this.socket.isImageLoading = true;
            this.image += data.replace('/image', '');

            clearTimeout(this.receiveTimeout);
            this.receiveTimeout = setTimeout((function() {
                this.socket.send('{"err": "cannot receive your image", "errfrom": "timeout"}');
                this.image = '';
                this.socket.isImageLoading = false;
                clearTimeout(this.receiveTimeout);
            }).bind(this), 1000);

            if(this.image.indexOf(';END;')>0) {
                clearTimeout(this.receiveTimeout);
                var size = 3*(Buffer.byteLength(this.image, 'utf8')/4);
                if(size > config.imageSizeLimit) {
                    this.socket.send('{"err": "your image should be under '+config.imageSizeLimit+' bytes", "type":"image"}');
                    this.image = '';
                    this.socket.isImageLoading = false;
                    return;
                }
                try {
                    this.image = this.image.replace(';END;','');
                    data = JSON.parse(this.image);
                } catch(e) {
                    this.socket.send('{"err": "invalid image", "type":"image"}');
                    this.image = '';
                    this.socket.isImageLoading = false;
                    return;
                }
                if(format.indexOf(data.type)>=0) {
                    var base64Data = data.image.replace(/^data:image\/([a-z])+;base64,/, "");
                    var img_path = this.socket.client.id+"_"+shortid.generate()+"."+data.type;
                    fs.writeFile("images/"+img_path, base64Data, 'base64', (function() {
                        this.socket.logger._RECEIVE_IMAGE('http://'+config.ip+':'+config.image_server.port+'/img/'+img_path);
                        this.socket.send('{"err":"false", "url":"http://'+config.ip+':'+config.image_server.port+'/img/'+img_path+'"}');
                    }).bind(this));
                    this.socket.isImageLoading = false;
                    this.image = '';
                }
            }

        }).bind(this));
    }

    return ImageManager;
})();


module.exports = ImageManager;