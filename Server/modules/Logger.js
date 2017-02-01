"use strict"

var Client = require('./client/client');

var colors      = require('colors');

function throwError(client, message) {
    if(client && client.socket && client.socket.emit)
        client.socket.emit('end');
    throw "ConfMessage : "+ message;
}

if(!process.env.debug) {
    process.on('uncaughtException', function (err) {
        console.log('\t\t'+colors.red(err));
    });
}

var Logger = (function() {

    function Logger(client){
        if(!client instanceof Client)
            throwError(client, "Logger have an instance of Client");
        this.client = client;
    }

    Logger.prototype._CLIENT_CONNECTED = function() {
        console.log(colors.yellow(this.client.name + ' join the server with '+ this.client.socket.type+' connection'));
    }
    Logger.prototype._CLIENT_SEND_MESSAGE= function(message) {
        if(!message)
            throwError(this.client, "_CLIENT_SEND_MESSAGE must have a String");
        console.log(colors.yellow(this.client.name) + colors.grey(' : ') + colors.white(message));
    }
    Logger.prototype._CLIENT_DECONNECTED= function() {
        console.log(colors.yellow(this.client.name + ' leave the server'));
    }
    Logger.prototype._RECEIVE_IMAGE = function(path) {
        if(!path)
            throwError(this.client, " _RECEIVE_IMAGE must have a String");
        console.log(colors.yellow(this.client.name)+ colors.grey(' : ') + colors.white('Send image '+path));
    };
    Logger.prototype._USER_CHANGE_NICK = function(newName) {
        console.log(colors.yellow(this.client.name) + colors.green(' change is nickname to '+ newName));
    }

    return Logger;
})();

module.exports = Logger;

