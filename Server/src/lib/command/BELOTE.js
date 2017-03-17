"use strict";

import Belote from './../channel/Belote';
import ERRSender from './../responses/ERRSender';

let debug = require('debug')('belote');
import colors from './../util/Color';

module.exports = function (socket, command) {
    if (!socket.client.isRegistered) {
        ERRSender.ERR_NOTREGISTERED(socket.client, 'JOIN');
    } else {

        let allowed = {
            'JOIN': (arg) => {
                let name = arg[1];
                if (!name.match(/\W/g) || name.match(/\W/g).join('') !== '&' || name[0] !== '&' || name.length <= 1) {
                    ERRSender.ERR_NOSUCHCHANNEL(socket.client, name);
                } else {
                    let err = true;
                    Belote.list().forEach((belote) => {
                        if(belote.name === name) {
                            err = false;
                            belote.addUser(socket.client);
                        }
                    });
                    if (err) {
                        debug('create');
                        let bel = new Belote(socket.client, name);
                        bel.addUser(socket.client);
                    }
                }
            },
            'READY': (arg) => {
                try {
                    let chan = arg[1];
                    let state = arg[2];

                    try {
                        Belote.list().forEach((belote) => {
                            if(chan === belote.name) {
                                belote.game.userSelectTeam(socket.client, state);
                            }
                        });
                    } catch(e) {
                        debug(e);
                    }

                } catch(e) {
                    ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'BELOTE READY');
                }
            },
            'TAKE': (arg) => {
                try {
                    let chan = arg[1];
                    let color = arg[2];

                    try {
                        Belote.list().forEach((belote) => {
                            if(chan === belote.name) {
                                belote.game.userTakeTrump(socket.client, color);
                            }
                        });
                    } catch(e) {
                        debug(e);
                    }
                } catch(e) {
                    ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'BELOTE TAKE');
                }
            },
            'PLAY': (arg) => {
                try {
                    let chan = arg[1];
                    let card = arg[2];

                    try {
                        Belote.list().forEach((belote) => {
                            if(chan === belote.name) {
                                belote.game.userPlayCard(socket.client, card);
                            }
                        });
                    } catch(e) {
                        debug(e);
                    }
                } catch(e) {
                    ERRSender.ERR_NEEDMOREPARAMS(socket.client, 'BELOTE PLAY');
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