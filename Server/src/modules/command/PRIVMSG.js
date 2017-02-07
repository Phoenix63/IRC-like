"use strict";

import Channel from './../channel/Channel';
import config from './../../config.json';
import Client from './../client/client';
import err from './../SignalManager';

module.exports = function(socket, command) {

    if(!socket.client.identity) {
        socket.send(':'+config.ip+' 451 * PRIVMSG :You have not registered');
        return;
    }

    let receivers = command[1].split(' ')[0].split(',');
    let message = command[1].split(':');
    if(!message[1]) {
        err.ERR_NOTEXTTOSEND(socket);
        return;
    }

    let clients = {};
    let channels = {};
    Channel.list().forEach((chan) => {
        channels[chan.name]= chan;
    });
    Client.list().forEach((cli) => {
        clients[cli.name] = cli;
    });
    let error = true;
    receivers.forEach((r) => {
        if(clients[r]) {
            clients[r].socket.send(':'+ socket.client.name+' PRIVMSG '+ r +' :'+message[1]);
            error = false;
        } else if (channels[r]) {
            if(channels[r].users.indexOf(socket.client)>=0) {
                channels[r].broadcast(':'+ socket.client.name+' PRIVMSG '+ r +' :'+message[1], socket.client);
                error = false;
            } else {
                err.ERR_CANNOTSENDTOCHAN(socket);
            }
        }
    });
    if(error) {
        err.ERR_NORECIPIENT(socket);
    }
}