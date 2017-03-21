"use strict";

import Channel from './../channel/Channel';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'WHO');
        return;
    }

    let name = command[1].split(' ')[0];
    if (name[0] === '#' || name[0] === '&') {
        Channel.list().forEach((chan) => {
            if (chan.name === name) {
                RPLSender.RPL_WHOREPLY(socket.client, chan);
            }
        });
    }
};