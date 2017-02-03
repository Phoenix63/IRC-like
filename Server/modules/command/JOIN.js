
var Channel     = require('./../channel/Channel');
var config      = require('./../../config.json');

module.exports = function(socket, command) {
    var name = command[1].split(' ')[0];
    var key = command[1].split(' ')[1] || '';

    var err = true;

    Channel.list().forEach(function(chan) {
        if(chan.name === name) {
            err = false;
            // join
            chan.addUser(socket.client, key);

            if(chan.topic) {
                socket.send(':'+config.ip+' 332 JOIN '+chan.name+' :'+chan.topic);
            } else {
                socket.send(':'+config.ip+' 331 JOIN '+chan.name+' :No topic is set');
            }

            chan.RPL_NAMREPLY(socket);


        }
    });
    if(err) {
        // create
        var chan = new Channel(socket.client, name, key, 20);
        chan.RPL_NAMREPLY(socket);
    }
}