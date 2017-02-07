var err     = require('./SignalManager');
var Channel     = require('./channel/Channel');
var config      = require('./../config.json');


var allowedCommand = {
    'NICK':     require('./command/NICK'),
    'JOIN':     require('./command/JOIN'),
    'PART':     require('./command/PART'),
    'PRIVMSG':  require('./command/PRIVMSG'),
    'NAMES':    require('./command/NAMES'),
    'LIST':     require('./command/LIST'),
    'QUIT':     require('./command/QUIT'),
    'WHO':      require('./command/WHO'),
    'USER':     require('./command/USER')
};

class CommandManager {

    constructor(socket) {
        this.socket = socket;
    }

    exec(command) {
        if(allowedCommand[command[0]]) {
            allowedCommand[command[0]](this.socket, command);
            return;
        } else {
            err.ERR_UNKNOWNCOMMAND(command[0], this.socket);
            return;
        }

    }
}

function parseMessage(line) {

    var command = line.match(/[A-Z]+([ ][^[a-zA-Z0-9#&:][a-zA-Z0-9 ]+)?/g);
    if(command) {
        return [command[0], line.replace(new RegExp(command[0]+"[ ]?"), '')];
    } else {
        throw "unknown command";
    }

}

class MessageManager {

    constructor(socket) {
        this.socket = socket;
        this.socket.commandManager = new CommandManager(socket);
        this.socket.on('message', ((str) => {
            this.socket.logger._USER_SEND_CMD(str);
            try {
                this.socket.commandManager.exec(parseMessage(str));
            } catch(e) {
                err.ERR_UNKNOWNCOMMAND(socket);
            }
        }).bind(this));
    }

}

module.exports = MessageManager;