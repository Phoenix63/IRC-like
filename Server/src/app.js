"use strict";
import RedisInterface from './modules/data/RedisInterface';
import dbSaver from './modules/data/dbSaver';
import dbLoader from './modules/data/dbLoader';
import socketManager from './modules/socket/socket';
import Client from './modules/client/Client';
import Logger from './modules/Logger';
import MessageManager from './modules/CommandManager';
import RPLSender from './modules/responses/RPLSender';
import colors from 'colors';
import Redis from './modules/data/RedisInterface';
import child_process from 'child_process';

RedisInterface.init();

process.env.parent = process.argv[2] || 'PROD';
//catches ctrl+c event
process.on('SIGINT', () => {
    console.log('Saving database...');
    //maybe we should close the sockets before save the DB
    dbSaver(() => {
        console.log('Database saved!');
        console.log('Quit redis');
        Redis.quit();
        process.exit();
    });
});
//catches uncaught exceptions
if (process.argv[2] === 'PROD') {
    process.on('uncaughtException', (err) => {
        if (err) {
            console.log(colors.red(err.stack));
        }
    });
}


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

if(process.env.parent === 'TEST') {
    let child = child_process.spawn('mocha', []);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
}