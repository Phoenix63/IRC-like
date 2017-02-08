"use strict";

import Channel from './../channel/Channel';
import ERRSender from './../responses/ERRSender';

module.exports = function(socket, command) {

    if(!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'JOIN');
        return;
    }

    let name = command[1].split(' ')[0];
    let key = command[1].split(' ')[1] || '';

    if(name[0] !== '#') {
        ERRSender.ERR_NOSUCHCHANNEL(socket.client, {name: name});
        return;
    }

    let err = true;

    Channel.list().forEach((chan) => {
        if(chan.name === name) {
            err = false;
            // join
            chan.addUser(socket.client, key);
        }
    });
    if(err) {
        // create
        new Channel(socket.client, name, key, 20);
    }
}