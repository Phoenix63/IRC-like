"use strict";

import Channel from './../channel/Channel';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'JOIN');
        return;
    }

    let name = command[1].split(' ')[0];
    let key = command[1].split(' ')[1] || '';

    if (name[0] !== '#') {
        ERRSender.ERR_NOSUCHCHANNEL(socket.client, {name: name});
        return;
    }

    let err = true;

    Channel.list().forEach((channel) => {
        if (channel.name === name) {
            err = false;
            // join
            channel.addUser(socket.client, key);
        }
    });
    if (err) {
        // create
        if (name.match(/(!^#)|(^G)|,/g) || name.length >= 50 || name ==='') {
            ERRSender.ERR_NOSUCHCHANNEL(creator, {name: name});
            return;
        }
        new Channel(socket.client, name, key, 20);
    }

}