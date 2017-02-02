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
                    channels[r].broadcast(':'+ socket.client.name+' PRIVMSG '+ r +' :'+message[1]);
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
        var users = [];
        Channel.list().forEach(function(chan) {
            var list = false;
            if((channels.indexOf(chan.name)>=0 || channels[0] === '')
                && ((!chan._isSecret && !chan._isPrivate) || chan.users.indexOf(socket.client)>=0)) {

                chan.users.forEach(function(u) {
                    if(users.indexOf(u)<0) {
                        users.push(u.name);
                    }
                });

            }
        });
        err.RPL_NAMREPLY(socket)
        users.forEach(function(u) {
            socket.send(u);
        });
        err.RPL_ENDOFNAMES(socket);
    },
    'LIST': function(socket, command) {
        var channels = command[1].split(' ')[0].split(',');

        var listChan = [];
        Channel.list().forEach(function(chan) {
            if((channels.indexOf(chan.name)>=0 || channels[0] === '')
                && (!chan._isSecret || chan.users.indexOf(socket.client)>=0)) {
                listChan.push((chan._isPrivate?'Prv':'')+chan.name);
            }
        });

        err.RPL_LIST(socket);
        err.RPL_LISTSTART(socket);
        listChan.forEach(function(c) {
           socket.send(c);
        });
        err.RPL_LISTEND(socket);
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