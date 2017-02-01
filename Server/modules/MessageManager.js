var err     = require('./ErrorManager');


var allowedCommand = {
    'NICK': function(socket, params){

    }
};

var CommandManager = (function() {

    function CommandManager(socket) {
        this.socket = socket;
    }

    CommandManager.prototype.exec = function(command, params) {
        if(allowedCommand[command]) {
            allowedCommand[command](this.socket, params);
            return;
        }
        err.ERR_UNKNOWCOMMAND(this.socket);
    };


    return CommandManager;
})();

function parseMessage(line) {

    var command = line.match(/[A-Z]+/g);
    if(command) {
        return [command[0], line.replace(new RegExp(command[0]+"[ ]?"), '')];
    }
    throw "unknow command";
}

var MessageManager = (function() {
    function MessageManager(socket) {
        this.socket = socket;
        this.socket.commandManager = new CommandManager(socket);
        this.socket.on('message', (function(str) {
            if(!this.socket.isImageLoading) {

                try {
                    this.socket.commandManager(this.socket, parseMessage(str));
                } catch(e) {
                    err.ERR_UNKNOWCOMMAND(this.socket);
                }

                //this.socket.commandManager.exec(parsedMessage[0], parsedMessage[1], parsedMessage[2]);
            }
        }).bind(this));
    }

    return MessageManager;

})();

module.exports = MessageManager;