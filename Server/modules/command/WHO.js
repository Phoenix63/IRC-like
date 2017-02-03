var Channel = require('./../channel/Channel');

module.exports = function(socket, command) {
    var name = command[1].split(' ')[0];
    if(name[0] === '#') {
        Channel.list().forEach(function(chan) {
            if(name === chan.name) {
                chan.RPL_WHOREPLY(socket);
            }
        });
    }
};