"use strict";

import Channel from './../channel/Channel';
import Client from './../client/Client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import config from './../../config.json';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'PRIVMSG');
        return;
    }

    let receivers = command[1].split(' ')[0].split(',');
    if (receivers.length <= 0) {
        ERRSender.ERR_NORECIPIENT(socket.client, 'PRIVMSG');
        return;
    }

    let message = command[1].replace(receivers + " ", "");
    if (!message || message[0] !== ':' || message.length < 2) {
        ERRSender.ERR_NOTEXTTOSEND(socket.client);
        return;
    }
    message = message.slice(1, message.length);

    let regcatch = /{[ ]?([-]?[0-9]+)[ ]?([+\-/*])[ ]?([\-]?[0-9]+)[ ]?}/g.exec(message);
    while (regcatch !== null) {
        let nb = [parseFloat(regcatch[1]), parseFloat(regcatch[3])];
        let val = regcatch[2]==='+'?nb[0]+nb[1]:regcatch[2]==='-'?nb[0]-nb[1]:regcatch[2]==='*'?nb[0]*nb[1]:nb[0]/nb[1];
        message = message.replace(regcatch[0], val);
        regcatch = /{[ ]?([-]?[0-9]+)[ ]?([+\-/*])[ ]?([\-]?[0-9]+)[ ]?}/g.exec(message);
    }
    message = message.replace(/(.*)faut y faire(.*)/gi, '$1faut le faire$2');
    message = message.replace(/(.*)j'y fai[st](.*)/gi, '$1je le fai$2');
    message = message.replace(/(.*)j'? ?y fass([a-z]+)(.*)/gi, '$1je le fass$2$3');
    message = message.replace(/(.*)si j'?y?'? ?aur(.*)/gi, '$1si j\'av$2');
    message = message.replace(/(.*)(nodejs|js|javascript) c[oô]t[eé] client(.*)/gi, '$1electron$3');
    message = message.replace(/(.*)o[uù] [cs]e?'? ?(que|ke)(.*)/gi, '$1où$3');
    message = message.replace(/(je|tu) peu[ts] (.*)/gi, '$1 peux $2');
    message = message.replace(/[ck]om?me? m[eê]m[e]?/gi, 'quand même');
    message = message.replace(/^ah$|^ha$|^a$/gi, ':AH:');


    let files = [];
    message.replace(/\[FILE=[^\]]/g, '');
    let regex = new RegExp('http(s)?://' + config.image_server.outip + ':' + config.image_server.port + '/public/[^ ]+', 'g');
    if (message.match(regex)) {
        files = message.match(regex);
    }

    let error = true;
    if (receivers.indexOf('@global') >= 0 && socket.client.isAdmin()) {
        socket.broadcast(':@[ADMIN]' + socket.client.name + ' PRIVMSG @global :' + message);
        receivers.splice(receivers.indexOf('@global'), 1);
    }
    let clients = {};
    let channels = {};
    Channel.list().forEach((chan) => {
        channels[chan.name] = chan;
    });
    Client.list().forEach((cli) => {
        clients[cli.name] = cli;
    });
    let errReceive = [];
    receivers.forEach((r) => {
        if (clients[r]) {
            if (clients[r].away) {
                RPLSender.RPL_AWAY(socket, clients[r].name, clients[r].away);
            } else {
                RPLSender.PRIVMSG(socket, clients[r], message);
            }
        } else if (channels[r]) {
            if ((channels[r].channelFlags.indexOf('n') > -1 && channels[r].users.indexOf(socket.client) >= 0) || channels[r].channelFlags.indexOf('n') === -1) {
                if (channels[r].isModerated && !channels[r].isUserVoice(socket.client)) {
                    ERRSender.ERR_CANNOTSENDTOCHAN(socket.client, channels[r].name);
                    return;
                }
                files.forEach((url) => {
                    channels[r].addFile(socket.client, url);
                    message.replace(url, '[FILE=' + url + ']');
                });
                RPLSender.PRIVMSG(socket, channels[r], message);
                channels[r].addMessage(socket.client, message);
            } else {
                ERRSender.ERR_CANNOTSENDTOCHAN(socket.client, r);
            }
        } else {
            errReceive.push(r);
        }
    });
    errReceive.forEach((err) => {
        if (err[0] === '#') {
            ERRSender.ERR_NOSUCHCHANNEL(socket.client, err);
        } else {
            ERRSender.ERR_NOSUCHNICK(socket.client, err);
        }
    });


};