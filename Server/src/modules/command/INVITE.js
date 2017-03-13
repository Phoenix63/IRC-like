"use strict";

import Channel from './../channel/Channel';
import Client from '../client/Client';
import ERRSender from './../responses/ERRSender';
import RPLSender from './../responses/RPLSender';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'INVITE');
        return;
    }
    let inviteRegex = /^([a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15}) (#[a-zA-Z0-9_-é"'ëäïöüâêîôûç`è]{1,15})[ ]*/.exec(command[1]);
    if (inviteRegex) {
        let nameOfTheGuest = inviteRegex[1];
        let nameChannel = inviteRegex[2];
        let channel = Channel.getChannelByName(nameChannel);
        let guest = Client.getClient(nameOfTheGuest);
        if (!guest) {
            ERRSender.ERR_NOSUCHNICK(socket.client, nameOfTheGuest);
            return;
        }
        if (!channel) {
            ERRSender.ERR_NOSUCHCHANNEL(socket.client, nameChannel);
            return;
        }
        if (!channel.isInvitation) {
            ERRSender.ERR_NOSUCHCHANNEL(socket.client, nameChannel);
            return;
        }
        if (!channel.isUserOperator(socket.client)) {
            ERRSender.ERR_CHANOPRIVSNEEDED(socket.client, nameChannel);
            return;
        }
        if (channel.getUser(guest.name)) {
            ERRSender.ERR_USERONCHANNEL(socket, guest.name, channel.name);
            return;
        }
        if (guest.away) {
            RPLSender.RPL_AWAY(socket, guest.name, guest.away);
            return;
        }
        channel.invite(socket, guest);
    } else {
        ERRSender.ERR_UNKNOWNCOMMAND(socket.client, command[1]);
    }
};