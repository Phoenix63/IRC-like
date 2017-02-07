"use strict";

if (!(process.argv[2] && process.argv[2] === 'DEV')) {
    process.on('uncaughtException', (err) => {
        console.log('\t\t' + colors.red(err));
    });
}

// globals
import colors from 'colors';

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
        let req = str.split(' ');
        if(req[0] === 'clients') {
            if(Client.list().length > 0) {
                let ret = '';
                ret += '-- Client list --\n';
                for(let i=0; i<Client.list().length; i++) {
                    ret += i + '\t\t'+ Client.list()[i].name+'\t\t'+ Client.list()[i].id+'\t\t'+Client.list()[i].socket.type+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no client connected'));
            }
        } else if (req[0] === 'send' && req[1] && req[2]) {
            try {
                let cli = Client.find(req[1]);
                let i = 2;
                let ret;
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
            let i = 1;
            let ret = '';
            while(req[i]) {
                ret += req[i]+' ';
                i++;
            }
            Client.list().forEach(function(c) {
                c.socket.send(ret);
                console.log(colors.green('YOU')+colors.white(' >> ')+ colors.yellow(c.name)+ ' : '+colors.white(ret));
            });
        } else if (req[0] === 'channels') {
            let list = Channel.list(true);
            if(list.length > 0) {
                let ret = '';
                ret += '-- Channels --\n';
                for(let i=0; i<list.length; i++) {
                    ret += i + '\t\t'+ list[i].name + '\t\t' + list[i].users.length+'/'+list[i].maxSize+'\n';
                }

                console.log(colors.yellow(ret));
            } else {
                console.log(colors.yellow('no channel connected'));
            }
        }
    }
};

let app = new App();