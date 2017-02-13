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
import MessageManager from './modules/CommandManager';
import RPLSender from './modules/responses/RPLSender';

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
