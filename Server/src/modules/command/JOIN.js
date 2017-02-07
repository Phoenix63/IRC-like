"use strict";

import Channel from './../channel/Channel';
import config from './../../config.json';

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * JOIN :You have not registered');
        return;
    }

    let name = command[1].split(' ')[0];
    let key = command[1].split(' ')[1] || '';

    let err = true;

    Channel.list().forEach((chan) => {
        if(chan.name === name) {
            err = false;
            // join
            chan.addUser(socket.client, key);

            if(chan.topic) {
                socket.send(':'+config.ip+' 332 JOIN '+chan.name+' :'+chan.topic);
            } else {
                socket.send(':'+config.ip+' 331 JOIN '+chan.name+' :No topic is set');
            }

            chan.RPL_NAMREPLY(socket);


        }
    });
    if(err) {
        // create
        let chan = new Channel(socket.client, name, key, 20);
        chan.RPL_NAMREPLY(socket);
    }
}