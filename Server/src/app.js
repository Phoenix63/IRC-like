let spawn = require('child_process').spawn;
let debug = require('debug')('pandirc:runner');

process.env.RUNNING = process.env.RUNNING || 'PROD';

let child = null;

function _start() {
    child = spawn('node', ['./dist/run.js'], {RUNNING: process.env.RUNNING, DEBUG:process.env.DEBUG});

    debug('running server...');

    child.stdout.on('data', function (data) {   process.stdout.write(data.toString());  });

    child.stderr.on('data', function (data) {   process.stdout.write(data.toString());  });

    child.on('close', function (code) {
        debug("Finished with code " + code);
        if(!code || code === 15) {
            _start();
        } else {
            process.exit(0);
        }
    });
}

_start();

process.on('SIGINT', function() {
    if(child) {
        child.kill('SIGINT');
    }
});