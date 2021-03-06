import RedisInterface from './../lib/data/RedisInterface';
import dbSaver from './../lib/data/dbSaver';
import dbLoader from './../lib/data/dbLoader';
import colors from './../lib/util/Color';
import Channel from './../lib/channel/Channel';
import Socket from './../lib/socket/socket';

process.title = 'pandirc:master';

module.exports = {
    run: run
};

function run(cluster) {
    "use strict";
    let _quiting = false;

    let debug = require('debug')('pandirc:app:master');

    RedisInterface.init();

    process.env.RUNNING = process.env.RUNNING || 'PROD';
    setInterval(()=>{
        dbSaver(() => {
            debug(colors.yellow('Automatic backup : Database saved!'));
        });
    },1800000);
    process.on('SIGINT', () => {
        if(!_quiting) {
            _quiting = true;
            debug(colors.yellow('Saving database...'));
            dbSaver(() => {
                debug(colors.yellow('Database saved!'));
                RedisInterface.quit();
                process.exit(2);
            });
        }

    });
    process.on('SIGTERM', () => {
        if(!_quiting) {
            _quiting = true;
            debug(colors.red('Server is going to restart'));
            debug(colors.yellow('Saving database...'));
            dbSaver(() => {
                debug(colors.yellow('Database saved!'));
                RedisInterface.quit();
                process.exit(15);
            });
        }
    });

    if (process.env.RUNNING === 'PROD') {
        process.on('uncaughtException', (err) => {
            if (err) {
                debug(colors.red(err.stack));
            } else {
                debug(colors.red('undefined error has been catched'));
            }
        });
    }
    debug(colors.green('Running pandirc:master'));
    dbLoader(() => {
        debug(colors.green('Database loaded'));
        let server = cluster.fork();

        server.on('message', (message) => {
            if(message.quitmessage) {
                if(message.quitmessage === 'restart') {
                    server.disconnect();
                    server.kill();
                } else if (message.quitmessage === 'quit') {
                    server._quitSignal = 'quit';
                    server.disconnect();
                    server.kill();
                }
            } else if (message.getChannels) {
                server.send({
                    type: 'channels',
                    channels: Channel.list()
                });
            } else if (message.getBannedIP) {
                server.send({
                    type: 'banip',
                    ban: Socket.getBannedIP()
                });
            }
        });
        server.on('exit', () => {
            if(server._quitSignal && server._quitSignal === 'quit') {
                process.kill(process.pid, 'SIGINT');
            } else {
                process.kill(process.pid, 'SIGTERM');
            }
        });
    });
}
