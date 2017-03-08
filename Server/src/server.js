"use strict";

var debug = require('debug')('server:server');
import getpid from 'getpid';

process.env.parent = process.argv[2] || 'PROD';

import dbSaver from './modules/data/dbSaver';
import child_process from 'child_process';

// globals
import colors from './modules/util/Color';

// socket
import socketManager from './modules/socket/socket';
import Client from './modules/client/client';
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
        debug(e);
    }
    if(!quiting) {
        for(let key in cluster.workers) {
            cluster.workers[key].kill();
        }
        quiting = true;
        debug('saving database...');
        dbSaver(true, () => {
            debug('database saved!');
            for(let id in cluster.workers) {
                cluster.workers[id].kill();
            }

            if(process.env.parent === 'DEV') {
                getpid('servernodemon', (err, pid) => {
                    if(err) {
                        debug(err);
                    } else {
                        if(Array.isArray(pid)) {
                            pid.forEach((i) => {
                                process.kill(i, 'SIGTERM');
                            });
                            callback();
                            process.exit();
                        } else {
                            if(pid) {
                                process.kill(pid, 'SIGTERM');
                                callback();
                                process.exit();
                            } else {
                                callback();
                                process.exit();
                            }
                        }
                    }
                });
            } else {
                callback();
                process.exit(0);
            }

        });
    }
}


if(cluster.isMaster) {
    process.title = 'MasterServer';

    debug('Cluster Master');
    dbLoader(() => {
        debug('Database loaded!');
        for(let i = 0 ; i<numCPUs; i++) {
            cluster.fork();
        }
    });
    process.on('SIGINT', () => {
        quitHandle('SIGINT', () => {
            process.exit();
        });
    });
    process.on('SIGTERM', () => {
        quitHandle('SIGTERM', () => {
            process.exit();
        })
    });
    process.on('SIGUSR2', () => {
        quitHandle('SIGUSR2', () => {
            process.kill(process.pid, 'SIGUSR2');
        })
    });

    process.on('message', (message) => {
        if(message === 'SIGTERM') {
            quitHandle(null, () => {
                process.send('I am dead');
                process.exit();
            });
        }
    });

    process.on('uncaughtException', (err) => {
        debug(colors.red(err));
        quitHandle('uncaughtException', () => {
            process.exit();
        });
    });

    cluster.on('message', (worker, msg) => {
        if(msg && msg.quitmessage) {
            debug('restarting...');
            quitHandle(null, ()=> {
                process.exit();
            });
        }
    });
    cluster.on('exit', (worker, code, signal) => {
        debug('kill '+signal);
        if(signal !== 'SIGTERM' && signal !== 'SIGINT' && process.env.parent !== 'TEST') {
            debug('restarting a worker');
            cluster.fork();
        }
    });

}
if(cluster.isWorker) {
    debug('Cluster Worker');
    debug('Server listening...');
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
            console.log(data.toString());
        });

        child.on('exit', function () {
            getpid('MasterServer', (err, pid) => {
                if(err) {
                    debug(err);
                } else {
                    if(Array.isArray(pid)) {
                        pid.forEach((i) => {
                            process.kill(i, 'SIGTERM');
                        });
                    } else {
                        if(pid) {
                            process.kill(pid, 'SIGTERM');
                        } else {
                        }
                    }
                }
            });
        });
    }
}






