"use strict";

process.env.parent = process.argv[2] || 'PROD';
console.log = (txt) => {
    process.stdout.write(txt+'\n');
}

import dbSaver from './modules/data/dbSaver';
import child_process from 'child_process';

// globals
import colors from 'colors';

// socket
import socketManager from './modules/socket/socket';
import Client from './modules/client/Client';
import Logger from './modules/Logger';
import MessageManager from './modules/CommandManager';
import RPLSender from './modules/responses/RPLSender';
import dbLoader from './modules/data/dbLoader';

import cluster from 'cluster';

//const numCPUs = require("os").cpus().length;
const numCPUs = 1;

let quiting = false;
function quitHandle(e, callback=function(){}) {
    if(e) {
        console.log(e);
    }
    if(!quiting) {
        for(let key in cluster.workers) {
            cluster.workers[key].kill();
        }
        quiting = true;
        console.log('saving database...');
        dbSaver(true, () => {
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
    process.title = 'MasterServer';

    console.log('Cluster Master');
    dbLoader(() => {
        console.log('Database loaded!');
        for(let i = 0 ; i<numCPUs; i++) {
            cluster.fork();
        }
    });

    process.on('exit', quitHandle);

    process.on('SIGINT', quitHandle);
    process.on('SIGTERM', quitHandle);

    if (!(process.env.parent === 'DEV' || process.env.parent === 'TEST')) {
        process.on('uncaughtException', (err) => {
            console.log('ERROR: \t\t' + colors.red(err));
        });
    } else {
        process.on('uncaughtException', quitHandle);
    }

    cluster.on('message', (worker, msg) => {
        if(msg && msg.quitmessage) {
            console.log('restarting...');
            quitHandle(null, ()=> {

            });
        }
    });
    cluster.on('exit', (worker, code, signal) => {

        if(signal !== 'SIGTERM' && signal !== 'SIGINT' && process.arv[2] !== 'TEST') {
            cluster.fork();
        }
    });

}
if(cluster.isWorker) {
    console.log('Cluster Worker');
    process.title = 'server';
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

    if(process.env.parent === 'TEST') {
        let child = child_process.spawn('mocha', []);
        child.stdout.on('data', function (data) {
            console.log('data: '+data.toString());
        });

        child.on('exit', function (code) {
            console.log('Test process ' + code.toString());
            quitHandle();
        });
    }
}






