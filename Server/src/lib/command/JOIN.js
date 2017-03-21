"use strict";

import Channel from './../channel/Channel';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'JOIN');
    } else {
        let name = command[1].split(' ')[0];
        let key = command[1].split(' ')[1] || '';


        if (!name.match(/\W/g) || name.match(/\W/g).join('') !== '#' || name[0] !== '#' || name.length <= 1) {
            ERRSender.ERR_NOSUCHCHANNEL(socket.client, name);
        } else {
            let err = true;
            Channel.list().forEach((channel) => {
                if (channel.name === name) {
                    err = false;
                    channel.addUser(socket.client, key);
                }
            });
            if (err) {
                let chan = new Channel(socket.client, name, key, 20);
                chan.addUser(socket.client, key);
            }
        }
    }
};