"use strict";

import Channel from './../channel/Channel';
import config from './../../config.json';

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * NAMES :You have not registered');
        return;
    }

    let channels = command[1].split(' ')[0].split(',');

    Channel.list().forEach((chan) => {
        if((channels.indexOf(chan.name)>=0 || channels[0] === '')
            && ((!chan._isSecret && !chan._isPrivate) || chan.users.indexOf(socket.client)>=0)) {

            let ret = ':'+config.ip+' 353 JOIN @ '+chan.name;
            let us = '';
            chan.users.forEach(function(u) {
                us += ' @'+u.name;
            });
            if(us)
                socket.send(ret+(us?' :'+us.slice(1,us.length):''));
            socket.send(':'+config.ip+' 366 JOIN :End of /NAMES list');

        }
    });
}