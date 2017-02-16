"use strict";

import config from './../../config.json';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {

    if (socket.client.isRegistered) {
        ERRSender.ERR_ALREADYREGISTRED(socket.client);
        return;
    }


    let cmd = command[1].split(' ');
    let name = cmd[0];
    let realname = cmd.splice(3, cmd.length).join(' ');
    if(realname[0] !== ':' || realname.length<2) {
        realname = null;
    } else {
        realname = realname.slice(1,realname.length);
    }
    console.log(realname);

    if (!name || !realname) {
        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'USER');
        return;
    }


    socket.client.setIdentity(name, realname);

};
