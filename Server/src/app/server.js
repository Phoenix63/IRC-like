import RedisInterface from './../lib/data/RedisInterface';
import socketManager from './../lib/socket/socket';
import Client from './../lib/client/Client';
import Logger from './../lib/Logger';
import MessageManager from './../lib/CommandManager';
import RPLSender from './../lib/responses/RPLSender';
import colors from './../lib/util/Color';
import child_process from 'child_process';

process.title = 'pandirc:server';

module.exports = {
    run: run
};

function run(cluster) {
    "use strict";

    RedisInterface.init();

    let debug = require('debug')('server:app:server');
    let test = require('debug')('app:test');

    process.env.RUNNING = process.env.RUNNING || 'PROD';

    debug(colors.green('Server running...'));
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


    if(process.env.RUNNING === 'TEST') {
        let child = child_process.spawn('mocha');
        child.stdout.on('data', function (data) {
            test(data.toString());
        });
        child.on('exit', function() {
            cluster.worker.send({quitmessage: 'quit'});
        });
    }
}
