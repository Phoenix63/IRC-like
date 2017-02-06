
var config = require('./../../config.json');

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * QUIT :You have not registered');
        return;
    }

    socket.client.channels.forEach(function(chan) {
        chan.users.forEach(function(u) {
            u.socket.send(':'+socket.client.name+'!'+config.ip+' QUIT :Gone');
        });
    });
    socket.client.delete();
}