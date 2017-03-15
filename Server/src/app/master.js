import RedisInterface from './../lib/data/RedisInterface';
import dbSaver from './../lib/data/dbSaver';
import dbLoader from './../lib/data/dbLoader';
import colors from './../lib/util/Color';

module.exports = {
    run: run
};

function run(cluster) {
    "use strict";

    let debug = require('debug')('server:app:master');

    RedisInterface.init();

    process.env.RUNNING = process.env.RUNNING || 'PROD';

    process.on('SIGINT', () => {
        debug(colors.yellow('Saving database...'));
        dbSaver(() => {
            debug(colors.yellow('Database saved!'));
            RedisInterface.quit();
            process.exit();
        });
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
            debug(message);
        });
    });
}
