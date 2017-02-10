"use strict";

import Channel from './../channel/Channel';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'PART');
        return;
    }

    let channels = command[1].split(' ')[0].split(',');
    Channel.list().forEach((chan) => {
        if (channels.indexOf(chan.name) >= 0) {
            chan.removeUser(socket.client);
        }
    });
};