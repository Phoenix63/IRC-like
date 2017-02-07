"use strict"
// true : coupe le serveur sur une erreur
// false : laisse le serveur tourner sur une erreur

process.env.debug = true;

// globals
import colors from 'colors';
import prompter from './prompter.js';

// socket

import socketManager from './modules/socket/socket';
import Client from './modules/client/client';
import Logger from './modules/Logger';
import MessageManager from './modules/MessageManager';

// channels

import Channel from './modules/channel/Channel';


socketManager.create((socket) => {

    let c = new Client(socket);
    let logger = new Logger(c);
    c.socket.logger = logger;
    c.socket.messageManager = new MessageManager(c.socket);
    c.socket.imageManager = new ImageManager(c.socket);

    socket.on('connect', () => {
        logger._CLIENT_CONNECTED();
    });

    socket.on('end', () => {
        logger._CLIENT_DECONNECTED();
        c.delete();
    });
    socket.on('close', () => {
        logger._CLIENT_DECONNECTED();
        c.delete();
    });
});

class App {

    constructor() {

    }

    query(str) {
        var req = str.split(' ');
        if(req[0] === 'clients') {
            if(Client.list().length > 0) {
                var ret = '';
                ret += '-- Client list --\n';
                for(var i=0; i<Client.list().length; i++) {
                    ret += i + '\t\t'+ Client.list()[i].name+'\t\t'+ Client.list()[i].id+'\t\t'+Client.list()[i].socket.type+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no client connected'));
            }
        } else if (req[0] === 'send' && req[1] && req[2]) {
            try {
                var cli = Client.find(req[1]);
                var i = 2;
                ret = '';
                while(req[i]) {
                    ret += req[i]+' ';
                    i++;
                }
                cli.socket.send(ret);
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(cli.name)+ ' : '+colors.white(ret));
            } catch(e) {
                console.log(colors.yellow(e));
            }

        } else if (req[0] === 'bc' && req[1]) {
            var i = 1;
            var ret = '';
            while(req[i]) {
                ret += req[i]+' ';
                i++;
            }
            Client.list().forEach(function(c) {
                c.socket.send(ret);
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(c.name)+ ' : '+colors.white(ret));
            });
        } else if (req[0] === 'channels') {
            var list = Channel.list(true);
            if(list.length > 0) {
                var ret = '';
                ret += '-- Channels --\n';
                for(var i=0; i<list.length; i++) {
                    ret += i + '\t\t'+ list[i].name + '\t\t' + list[i].users.length+'/'+list[i].maxSize+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no channel connected'));
            }
        }
    }
};

var app = new App();

prompter(app);