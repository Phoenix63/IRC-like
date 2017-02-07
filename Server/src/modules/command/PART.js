"use strict";

import Channel from './../channel/Channel';
import config from './../../config.json';

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * PART :You have not registered');
        return;
    }

    let channels = command[1].split(' ')[0].split(',');
    Channel.list().forEach((chan) => {
        if(channels.indexOf(chan.name) >= 0) {
            chan.removeUser(socket.client);
        }
    });
}