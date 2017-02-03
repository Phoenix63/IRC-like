var err     = require('./../SignalManager');
var Channel     = require('./../channel/Channel');
var config      = require('./../../config.json');
var Client      = require('./../client/client');

module.exports = function(socket, command) {
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
}