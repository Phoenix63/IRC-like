"use strict";

import config from './../../config.json';
import ERRSender from './../responses/ERRSender';

module.exports = function(socket, command) {

    if(!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'QUIT');
        return;
    }

    socket.client.channels.forEach((chan) => {
        chan.broadcast(':'+socket.client.name+'!'+config.ip+' QUIT :Gone')
    });
    socket.client.delete();
}