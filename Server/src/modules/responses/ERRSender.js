"use strict";

import config from './../../config.json';

let ERRSender = {
    /**
     *
     * @param {Client} client
     * @param {Channel|Object} channel
     */
    ERR_NOSUCHCHANNEL: (client, channel) => {
        client.socket.send(':' + config.ip + ' 403 ' + channel.name + ' :No such channel');
    },
    /**
     *
     * @param {Client} client
     * @param {Channel.name} channel
     * @static
     */
    ERR_CANNOTSENDTOCHAN: (client, channel) => {
        client.socket.send(':' + config.ip + ' 404 ' + channel + ' :Cannot send to channel');
    },
    /**
     *
     * @param {Client} client
     * @param {string} command
     * @static
     */
    ERR_NORECIPIENT: (client, command) => {
        client.socket.send(':' + config.ip + ' 411 :No recipient give (' + command + ')');
    },
    /**
     *
     * @param {Client} client
     * @static
     */
    ERR_NOTEXTTOSEND: (client) => {
        client.socket.send(':' + config.ip + ' 412 :No text to send');
    },
    /**
     *
     * @param {Client} client
     * @param {string} command
     * @static
     */
    ERR_UNKNOWNCOMMAND: (client, command) => {
        client.socket.send(':' + config.ip + ' 421 ' + command + ' :Unknown command');
    },
    /**
     *
     * @param {Client} client
     * @static
     */
    ERR_NONICKNAMEGIVEN: (client) => {
        client.socket.send(':' + config.ip + ' 431 :No nickname given');
    },
    /**
     *
     * @param {Client} client
     * @static
     */
    ERR_NICKNAMEINUSE: (client) => {
        client.socket.send(':' + config.ip + ' 433 ' + client.name + ' :Nickname is already in use');
    },
    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     * @static
     */
    ERR_NOTONCHANNEL: (client, channel) => {
        client.socket.send(':' + config.ip + ' 442 ' + channel.name + ' :You\'re not on that channel');
    },
    /**
     *
     * @param {Client} client
     * @param {string} command
     * @static
     */
    ERR_NOTREGISTERED: (client, command) => {
        client.socket.send(':' + config.ip + ' 451 * ' + command + ' :You have not registered');
    },
    /**
     *
     * @param {Client} client
     * @param {string} command
     * @static
     */
    ERR_NEEDMOREPARAMS: (client, command) => {
        client.socket.send(':' + config.ip + ' 461 ' + command + ' :Not enough parameters')
    },
    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     */
    ERR_CHANNELISFULL: (client, channel) => {
        client.socket.send(':' + config.ip + ' 471 ' + channel.name + ' :Cannot join channel (+l)');
    },
    /**
     *
     * @param {Client} client
     * @static
     */
    ERR_ALREADYREGISTRED: (client) => {
        client.socket.send(':' + config.ip + ' 462 :Unauthorized command (already registered)');
    },

    /**
     *
     * @param {Client} client
     * @static
     */
    ERR_PASSWDMISMATCH: (client) => {
        client.socket.send(':'+ config.ip + ' 464 '+client.name+ ' :Password incorrect');
    },
    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     */
    ERR_INVITEONLYCHAN: (client, channel) => {
        client.socket.send(':' + config.ip + ' 473 ' + channel.name + ' :Cannot join channel (+i)');
    },
    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     */
    ERR_BANNEDFROMCHAN: (client, channel) => {
        client.socket.send(':' + config.ip + ' 474 ' + channel.name + ' :Cannot join channel (+b)');
    },
    /**
     *
     * @param {Client} client
     * @param {Channel} channel
     */
    ERR_BADCHANNELKEY: (client, channel) => {
        client.socket.send(':' + config.ip + ' 475 ' + channel.name + ' :Cannot join channel (+k)');
    }


};
export default ERRSender;