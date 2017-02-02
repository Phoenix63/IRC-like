
var Channel     = require('./../channel/Channel');
var config      = require('./../../config.json');

module.exports = function(socket, command) {
    var channel = command[1].split(' ')[0];
    var error = false;
    if(channel[0] === '#') {
        Channel.list().forEach(function(chan) {
            if(chan.name === channel)
                chan.users.forEach(function(u) {
                    socket.send("RPL_WHOREPLY "+chan.name+" "+config.ip+" "+config.ip+" "+u.name+" G :0 "+u.name);
                    error = false;
                });
        })


    } else {
        error = true;
    }
    if(error) {
        socket.send("RPL_ENDOFWHO "+u.name+" :End of /WHO list");
        return;
    }
}