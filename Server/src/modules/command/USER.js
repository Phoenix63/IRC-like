"use strict";

import config from './../../config.json';

module.exports = function(socket, command) {

    if(socket.client.identity) {
        socket.send(':'+config.ip+' 462 :Unauthorized command (already registered)');
        return;
    }

    try {
        let cmd = command[1].split(' ');
        let name = cmd[0];
        let realname = cmd[3];

        let valid = socket.client.setIdentity(name);

        if(realname[0] === ':') {
            socket.client.realname = realname.replace(':','');
        } else {
            throw ':'+config.ip+' 461 USER :Not enough parameters';
        }






    } catch(e) {
        socket.client.identity = null;
        socket.client.realname = null;
        socket.send();
    }

};
