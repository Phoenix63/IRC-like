"use strict";

process.title = 'server';

console.log = function(arg) {
    process.stdout.write(arg+'\n');
};

import dbSaver from './modules/data/dbSaver';

// globals
import colors from 'colors';

// socket
import socketManager from './modules/socket/socket';
import Client from './modules/client/client';
import Logger from './modules/Logger';
import MessageManager from './modules/CommandManager';
import RPLSender from './modules/responses/RPLSender';
import dbLoader from './modules/data/dbLoader';

import cluster from 'cluster';

const numCPUs = require("os").cpus().length;

let quiting = false;
function quitHandle(e, callback=function(){}) {
    if(e) {
        console.log(e);
    }
    if(!quiting) {
        quiting = true;
        console.log('saving database...');
        dbSaver(false, () => {
            console.log('database saved!');
            for(let id in cluster.workers) {
                cluster.workers[id].kill();
            }
            callback();
            process.exit(0);
        });
    }
}


if(cluster.isMaster) {
    dbLoader(() => {
        console.log('Database loaded!');
        for(let i = 0 ; i<numCPUs; i++) {
            cluster.fork();
        }
    });

    process.on('exit', quitHandle);

    process.on('SIGINT', quitHandle);

    if (!(process.argv[2] && (process.argv[2] === 'DEV' || process.argv[2] === 'TEST'))) {
        process.on('uncaughtException', (err) => {
            console.log('\t\t' + colors.red(err));
        });
    } else {
        process.on('uncaughtException', quitHandle);
    }

    cluster.on('message', (worker, msg) => {
        if(msg && msg.quitmessage) {
            console.log('restart...');
            for(let key in cluster.workers) {
                cluster.workers[key].kill();
            }
            cluster.worker.kill();
        }
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log('worker '+worker.process.pid+' died');
        cluster.fork();
    });

}
if(cluster.isWorker) {
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
}






