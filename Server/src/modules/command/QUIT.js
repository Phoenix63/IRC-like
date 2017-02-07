"use strict";

import config from './../../config.json';

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * QUIT :You have not registered');
        return;
    }

    socket.client.channels.forEach((chan) => {
        chan.users.forEach((u) => {
            u.socket.send(':'+socket.client.name+'!'+config.ip+' QUIT :Gone');
        });
    });
    socket.client.delete();
}