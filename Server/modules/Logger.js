var Client = require('./client/client');

var colors      = require('colors');

function throwError(client, message) {
    if(client && client.socket && client.socket.emit)
        client.socket.emit('end');
    throw "[line "+__lineError + "] ConfMessage : " + __callerName + " "+ message;
}

if(!process.env.debug) {
    process.on('uncaughtException', function (err) {
        console.log('\t\t'+colors.red(err));
    });
}

var Logger = (function() {

    function Logger(client){
        if(!client instanceof Client.client)
            throwError(client, "must be an instance of Client");
        this.client = client;
    }

    Logger.prototype._CLIENT_CONNECTED = function() {
        console.log(colors.yellow(this.client.id + ' join the server with '+ this.client.socket.type+' connection'));
    }
    Logger.prototype._CLIENT_SEND_MESSAGE= function(message) {
        if(!message)
            throwError(this.client, "must have a String");
        console.log(colors.yellow(this.client.id) + colors.grey(' : ') + colors.white(message));
    }
    Logger.prototype._CLIENT_DECONNECTED= function() {
        console.log(colors.yellow(this.client.id + ' leave the server'));
    }

    return Logger;
})();

module.exports = Logger;

