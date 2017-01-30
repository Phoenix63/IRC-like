
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

        this.socket.on('image', (function(data) {
            this.socket.isImageLoading = true;
            this.image += data.replace('/image', '');
            console.log('receiving image');

            if(this.image.indexOf(';END;')>0) {
                try {
                    this.image = this.image.replace(';END;','');
                    data = JSON.parse(this.image);
                } catch(e) {
                    //this.socket.send('{"err": "invalid image", "image": "'+data+'"}');
                    this.socket.isImageLoading = false;
                    this.image = '';
                    throw "invalid image received";

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