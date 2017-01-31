"use strict"

var Client  = require('./client/client');

function writeResp(socket, to, command, message, err) {
    socket.send('{"to":"'+to+'","command":"'+command+'","message":"'+message+'","err":"'+err+'"}');
}
function getJsonResp(from, type, message) {
    return '{"type":"'+type+'", "from":"'+from+'", "message":"'+message+'"}';
}

var commands = {
    "/message": function(socket, str) {
        socket.logger._CLIENT_SEND_MESSAGE(str);
        writeResp(socket, "broadcast", "/message", str, false);
        socket.broadcast(getJsonResp(socket.client.id, "message", str));
    },
    "/whisper": function(socket, str) {
        var idToSend = str.match(/([a-zA-Z0-9]+[ ])/gi)[0].replace(' ', '');
        try {
            var client = Client.find(idToSend);
            client.socket.send(getJsonResp(socket.client.id, "whisper", str.replace(idToSend+' ', '')));
            writeResp(socket, client.id, "/whisper", str.replace(idToSend+' ', ''), false);
        }
        catch (e) {
            writeResp(socket, null, "/whisper", "/w "+str, "no client found");
        }
    }
};
commands["/w"] = commands["/whisper"];
commands["/m"] = commands["/message"];

var CommandManager = (function() {
    function CommandManager(socket) {
        this.socket = socket;
    }
    CommandManager.check = function(command) {
        if(commands[command])
            return true;
        return false;
    };

    CommandManager.prototype.exec = function(str, image) {
        var command = str.match(/(\/([a-z])+[ ])/gi);
        var req = command[0].replace(' ','');

        commands[req](this.socket, str.replace(command, ''));
    };

    return CommandManager;
})();


var MessageManager = (function() {
    function MessageManager(socket) {
        this.socket = socket;
        this.socket.commandManager = new CommandManager(socket);
        this.socket.on('message', (function(str) {
            if(!this.socket.isImageLoading) {
                var command = str.match(/(\/([a-z])+[ ])/gi);
                if (command && command[0] && CommandManager.check(command[0].replace(' ', ''))) {
                    this.socket.commandManager.exec(str);
                } else {
                    socket.send('{"err": "Unknow command", "command":"' + str + '"}');
                }
            }

        }).bind(this));
    }

    return MessageManager;

})();

module.exports = MessageManager;