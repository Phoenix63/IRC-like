"use strict";

import Channel from './../channel/Channel';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'PART');
        return;
    }

    let message = command[1].split(' ')[1];
    if(message && message[0] === ':') {
        message = message.slice(1, message.length);
    } else {
        message = 'Gone';
    }

    let channels = command[1].split(' ')[0].split(',');
    socket.send(channels);
    Channel.list().forEach((chan) => {
        if (channels.indexOf(chan.name) >= 0) {
            chan.removeUser(socket.client, message);
            channels.splice(channels.indexOf(chan.name),1);
        }
    });
    channels.forEach((errname) => {
        ERRSender.ERR_NOSUCHCHANNEL(socket.client, errname);
    });
};