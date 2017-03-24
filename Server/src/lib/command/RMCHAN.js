"use strict";

import ERRSender from './../responses/ERRSender';
import Channel from './../channel/Channel';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'RMCHAN');
        return null;
    }

    if (!socket.client.isAdmin()) {
        ERRSender.ERR_NOPRIVILEGES(socket.client);
        return null;
    }

    let chan = (command[1].split(' ') || [''])[0];

    if(chan[0] !== '&' && chan[0] !== '#') {
        ERRSender.ERR_NOSUCHCHANNEL(socket.client, chan);
        return null;
    }

    let channel = Channel.getChannelByName(chan);
    if(!channel) {
        ERRSender.ERR_NOSUCHCHANNEL(socket.client, chan);
        return null;
    }

    channel.remove();
};