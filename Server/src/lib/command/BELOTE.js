"use strict";

import Belote from './../channel/Belote';
import ERRSender from './../responses/ERRSender';

let debug = require('debug')('pandirc:belote:command');

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'JOIN');
    } else {

        let allowed = {
            'JOIN': (arg) => {
                let name = arg[1];
                if (!name || !name.match(/\W/g) || name.match(/\W/g).join('') !== '&' || name[0] !== '&' || name.length <= 1) {
                    ERRSender.ERR_NOSUCHCHANNEL(socket.client, (name?name:'none'));
                } else {
                    let err = true;
                    Belote.list().forEach((belote) => {
                        if(belote.name === name) {
                            err = false;
                            belote.addUser(socket.client);
                        }
                    });
                    if (err) {
                        let bel = new Belote(socket.client, name);
                        bel.addUser(socket.client);
                    }
                }
            },
            'READY': (arg) => {
                let name = arg[1];
                let state = arg[2];

                if (!name || !name.match(/\W/g) || name.match(/\W/g).join('') !== '&' || name[0] !== '&' || name.length <= 1) {
                    ERRSender.ERR_NOSUCHCHANNEL(socket.client, (name?name:'none'));
                } else {
                    if(!state || [0,1].indexOf(parseInt(state)) < 0) {
                        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'BELOTE READY');
                    } else {
                        Belote.list().forEach((belote) => {
                            if(name === belote.name) {
                                belote.game.userSelectTeam(socket.client, state);
                            }
                        });
                    }
                }
            },
            'TAKE': (arg) => {
                let name = arg[1];
                let color = arg[2];

                if (!name || !name.match(/\W/g) || name.match(/\W/g).join('') !== '&' || name[0] !== '&' || name.length <= 1) {
                    ERRSender.ERR_NOSUCHCHANNEL(socket.client, (name?name:'none'));
                } else {
                    if(!color || isNaN(parseInt(color)) || parseInt(color) < -1 || parseInt(color) > 3) {
                        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'BELOTE TAKE');
                    } else {
                        Belote.list().forEach((belote) => {
                            if(name === belote.name) {
                                belote.game.userTakeTrump(socket.client, color);
                            }
                        });
                    }
                }
            },
            'PLAY': (arg) => {
                let name = arg[1];
                let card = arg[2];

                if (!name || !name.match(/\W/g) || name.match(/\W/g).join('') !== '&' || name[0] !== '&' || name.length <= 1) {
                    ERRSender.ERR_NOSUCHCHANNEL(socket.client, (name?name:'none'));
                } else {
                    if(!card || isNaN(parseInt(card)) || parseInt(card) < 0 || parseInt(card) > 31) {
                        ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'BELOTE TAKE');
                    } else {
                        Belote.list().forEach((belote) => {
                            if(name === belote.name) {
                                belote.game.userPlayCard(socket.client, card);
                            }
                        });
                    }
                }
            }
        }


        let cmd = command[1].split(' ');
        let commande = cmd[0];
        if(!allowed[commande]) {
            ERRSender.ERR_UNKNOWNCOMMAND(socket.client, command[0]+' '+commande);
            return;
        }
        allowed[commande](cmd);
    }
};