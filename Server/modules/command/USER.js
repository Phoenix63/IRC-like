var config      = require('./../../config.json');

module.exports = function(socket, command) {

    if(socket.client.identity) {
        socket.send(':'+config.ip+' 462 :Unauthorized command (already registered)');
        return;
    }

    try {
        var cmd = command[1].split(' ');
        var name = cmd[0];
        var realname = cmd[3];


        socket.client.identity = name;
        if(realname[0] === ':') {
            socket.client.realname = realname.replace(':','');
        } else {
            throw "error";
        }


    } catch(e) {
        socket.send(':'+config.ip+' 461 USER :Not enough parameters');
    }




}
