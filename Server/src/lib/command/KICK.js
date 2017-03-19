"use strict";

import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';
import Channel from './../channel/Channel';
import Client from './../client/Client';

module.exports = function (socket, command) {

    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'KICK');
        return;
    }

    try {
        let cmd = command[1].split(' ');
        let chan = cmd[0];

        if(!cmd[1] && socket.client.isAdmin()) {
            let user = chan;

            let kicked = Client.getClient(user);

            if(kicked) {
                if(socket.client.isAdmin() && !kicked.isAdmin() || socket.client.isSuperAdmin()) {
                    RPLSender.SKICK(socket.client, kicked);
                    kicked.socket._socket.destroy();
                } else {
                    ERRSender.ERR_NOPRIVILEGES(socket.client);
                }

            } else {
                ERRSender.ERR_NOSUCHNICK(socket.client, user);
                return null;
            }

        } else {
            if (chan[0] !== '#') {
                ERRSender.ERR_NOSUCHCHANNEL(socket.client, chan);
                return;
            }

            let channel = Channel.getChannelByName(chan);
            if (!channel) {
                ERRSender.ERR_NOSUCHCHANNEL(socket.client, chan);
            } else {
                if (channel.isUserOperator(socket.client)) {
                    let kicked = channel.getUser(cmd[1]);
                    if (kicked) {
                        RPLSender.KICK(socket.client, kicked, channel);
                        channel.removeUser(kicked);
                    } else {
                        ERRSender.ERR_NOTONCHANNEL(socket.client, chan);
                    }
                } else {
                    ERRSender.ERR_CHANOPRIVSNEEDED(socket.client, chan);
                }
            }
        }




    } catch (e) {
        console.log(e);
        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'KICK');
    }


};