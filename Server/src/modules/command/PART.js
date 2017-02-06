
var Channel     = require('./../channel/Channel');
var config      = require('./../../config.json');

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * PART :You have not registered');
        return;
    }

    var channels = command[1].split(' ')[0].split(',');
    Channel.list().forEach(function(chan) {
        if(channels.indexOf(chan.name) >= 0) {
            chan.removeUser(socket.client);
        }
    });
}