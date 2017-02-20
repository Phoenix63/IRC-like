"use strict";

process.title = 'server';

import dbSaver from './modules/data/dbSaver';

let quiting = false;
function quitHandle(e) {
    if(e) {
        console.log(e);
    }
    if(!quiting) {
        quiting = true;
        console.log('saving database...');
        dbSaver(false, () => {
            console.log('database saved!');
            process.exit(0);
        });
    }
}

process.on('exit', quitHandle);

process.on('SIGINT', quitHandle);

if (!(process.argv[2] && (process.argv[2] === 'DEV' || process.argv[2] === 'TEST'))) {
    process.on('uncaughtException', (err) => {
        console.log('\t\t' + colors.red(err));
    });
} else {
    process.on('uncaughtException', quitHandle);
}


// globals
import colors from 'colors';

// socket
import socketManager from './modules/socket/socket';
import Client from './modules/client/client';
import Logger from './modules/Logger';
import MessageManager from './modules/CommandManager';
import RPLSender from './modules/responses/RPLSender';
import dbLoader from './modules/data/dbLoader';

dbLoader(() => {
    console.log('Database loaded');
    socketManager.create((socket) => {
        let client = new Client(socket);
        let logger = new Logger(client);
        client.socket.logger = logger;
        client.socket.messageManager = new MessageManager(client.socket);
        socket.on('connect', () => {
            RPLSender.HEADER(socket);
            logger._CLIENT_CONNECTED();
        });
    });
});


