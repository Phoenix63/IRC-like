"use strict";

import Channel from './../channel/Channel';
import Client from './../client/client';
import ERRSender from './../responses/ERRSender';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'PRIVMSG');
        return;
    }

    let receivers = command[1].split(' ')[0].split(',');
    let message = command[1].split(':');
    if (!message[1]) {
        ERRSender.ERR_NOTEXTTOSEND(socket.client);
        return;
    }

    let clients = {};
    let channels = {};
    Channel.list().forEach((chan) => {
        channels[chan.name] = chan;
    });
    Client.list().forEach((cli) => {
        clients[cli.name] = cli;
    });
    let error = true;
    receivers.forEach((r) => {
        if (clients[r]) {
            clients[r].socket.send(':' + socket.client.name + ' PRIVMSG ' + r + ' :' + message[1]);
            error = false;
        } else if (channels[r]) {
            if (channels[r].users.indexOf(socket.client) >= 0) {
                channels[r].broadcast(':' + socket.client.name + ' PRIVMSG ' + r + ' :' + message[1], socket.client);
                error = false;
            } else {
                ERRSender.ERR_CANNOTSENDTOCHAN(socket.client, r);
            }
        }
    });
    if (error) {
        ERRSender.ERR_NORECIPIENT(socket.client, 'PRIVMSG');
    }
}