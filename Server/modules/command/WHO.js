var Channel = require('./../channel/Channel');
var config  = require('./../../config.json');

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * WHO :You have not registered');
        return;
    }

    var name = command[1].split(' ')[0];
    if(name[0] === '#') {
        Channel.list().forEach(function(chan) {
            if(name === chan.name) {
                chan.RPL_WHOREPLY(socket);
            }
        });
    }
};