import RedisInterface from './../lib/data/RedisInterface';
import dbSaver from './../lib/data/dbSaver';
import dbLoader from './../lib/data/dbLoader';
import colors from './../lib/util/Color';

process.title = 'pandirc:master';

module.exports = {
    run: run
};


function run(cluster) {
    "use strict";
    let _quiting = false;

    let debug = require('debug')('server:app:master');

    RedisInterface.init();

    process.env.RUNNING = process.env.RUNNING || 'PROD';

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

    dbLoader(() => {
        debug(colors.green('Database loaded'));
        let server = cluster.fork();

        server.on('message', (message) => {
            if(message.quitmessage && message.quitmessage === 'restart') {
                server.disconnect();
                server.kill();
            }
        });
        server.on('exit', () => {
            process.kill(process.pid, 'SIGTERM');
        });
    });
}
