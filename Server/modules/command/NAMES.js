
var Channel     = require('./../channel/Channel');
var config      = require('./../../config.json');

module.exports = function(socket, command) {
    var channels = command[1].split(' ')[0].split(',');

    Channel.list().forEach(function(chan) {
        if((channels.indexOf(chan.name)>=0 || channels[0] === '')
            && ((!chan._isSecret && !chan._isPrivate) || chan.users.indexOf(socket.client)>=0)) {
            socket.send(chan.toRPL_NAMREPLY());

        }
    });
}