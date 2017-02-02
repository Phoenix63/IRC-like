var err     = require('./SignalManager');
var Channel     = require('./channel/Channel');
var Client      = require('./client/client');


var allowedCommand = {
    'NICK': function(socket, command){
        socket.client.name = command[1].split(' ')[0];
    },
    'JOIN': function(socket, command) {
        var name = command[1].split(' ')[0];
        var key = command[1].split(' ')[1] || '';

        var err = true;

        Channel.list().forEach(function(chan) {
            if(chan.name === name) {
                err = false;
                // join
                chan.addUser(socket.client, key);

            }
        });
        if(err) {
            // create
            new Channel(socket.client, name, key, 2);
        }
    },
    'PRIVMSG': function(socket, command) {
        var receivers = command[1].split(' ')[0].split(',');
        var message = command[1].split(':');
        if(!message[1]) {
            err.ERR_NOTEXTTOSEND(socket);
            return;
        }

        var clients = {};
        var channels = {};
        Channel.list().forEach(function(chan) {
            channels[chan.name]= chan;
        });
        Client.list().forEach(function(cli) {
            clients[cli.name] = cli;
        });
        var error = true;
        receivers.forEach(function(r) {
            if(clients[r]) {
                clients[r].socket.send(':'+ socket.client.name+' PRIVMSG '+ r +' :'+message[1]);
                error = false;
            } else if (channels[r]) {
                if(channels[r].users.indexOf(socket.client)>=0) {
                    channels[r].broadcast(':'+ socket.client.name+' PRIVMSG '+ r +' :'+message[1], socket.client);
                    error = false;
                } else {
                    err.ERR_CANNOTSENDTOCHAN(socket);
                }
            }
        });
        if(error) {
            err.ERR_NORECIPIENT(socket);
        }
    },
    'NAMES': function(socket, command) {
        var channels = command[1].split(' ')[0].split(',');

        Channel.list().forEach(function(chan) {
            var list = false;
            if((channels.indexOf(chan.name)>=0 || channels[0] === '')
                && ((!chan._isSecret && !chan._isPrivate) || chan.users.indexOf(socket.client)>=0)) {
                var userList = '';
                chan.users.forEach(function(u) {
                    userList += ' @'+u.name;
                });
                socket.send('RPL_NAMREPLY '+chan.name+' :'+userList.slice(1,userList.length));
                socket.send(chan.name+' :End of /NAMES list');

            }
        });
    },
    'LIST': function(socket, command) {
        var channels = command[1].split(' ')[0].split(',');

        socket.send("RPL_LISTSTART");
        Channel.list().forEach(function(chan) {
            if(!chan._isSecret) {
                
            }
        });
    },
    'MODE': function(socket, command) {

    },
    'PING': function(socket, command) {

    },
    'CAP': function(socket, command) {

    }
};

var CommandManager = (function() {

    function CommandManager(socket) {
        this.socket = socket;
    }

    CommandManager.prototype.exec = function(command) {
        if(allowedCommand[command[0]]) {
            allowedCommand[command[0]](this.socket, command);
            return;
        } else {
            err.ERR_UNKNOWCOMMAND(this.socket);
            return;
        }

    };


    return CommandManager;
})();

function parseMessage(line) {

    var command = line.match(/[A-Z]+([ ][^[a-zA-Z0-9#&:][a-zA-Z0-9 ]+)?/g);
    if(command) {
        return [command[0], line.replace(new RegExp(command[0]+"[ ]?"), '')];
    } else {
        throw "unknow command";
    }

}

var MessageManager = (function() {
    function MessageManager(socket) {
        this.socket = socket;
        this.socket.commandManager = new CommandManager(socket);
        this.socket.on('message', (function(str) {
            if(!this.socket.isImageLoading) {
                try {
                    this.socket.logger._CLIENT_SEND_MESSAGE(str);
                    this.socket.commandManager.exec(parseMessage(str));
                } catch(e) {
                    console.log(e);
                    err.ERR_UNKNOWCOMMAND(this.socket);
                }

                //this.socket.commandManager.exec(parsedMessage[0], parsedMessage[1], parsedMessage[2]);
            }
        }).bind(this));
    }

    return MessageManager;

})();

module.exports = MessageManager;