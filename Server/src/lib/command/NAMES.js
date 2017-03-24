"use strict";

import Channel from './../channel/Channel';

import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'NAMES');
        return;
    }

    let channels = command[1].split(' ')[0].split(',');

    Channel.list().forEach((chan) => {
        if ((channels.indexOf(chan.name) >= 0 || channels[0] === '')
            && ((!chan.isSecret && !chan.isPrivate) || chan.users.indexOf(socket.client) >= 0)) {

            RPLSender.RPL_NAMREPLY(socket.client, chan);

        }
    });
};