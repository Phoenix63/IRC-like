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
        let user = cmd[1];

        if(!user && socket.client.isAdmin()) {
            user = chan[0];

            client = Client.getClient(user);

            if(client) {

                RPLSender.SKICK(socket.client, kicked.name);
                client.socket.close();


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
                    let kicked = channel.getUser(user);
                    if (kicked) {
                        RPLSender.KICK(socket.client, kicked.name, channel);
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
        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'KICK');
    }


};