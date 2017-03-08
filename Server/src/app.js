import child_process from 'child_process';
let debug = require('debug')('server:app');

const env = process.argv[2] || 'PROD';
debug('ENV: '+env);

let childprocess = createChild();

var signals = {
    'SIGINT': 2,
    'SIGTERM': 15
};

Object.keys(signals).forEach(function (signal) {
    process.on(signal, function () {
        debug(signal);
        if(childprocess && childprocess.kill) {
            createChild = null;
            childprocess.kill('SIGTERM');
        }
    });

});

function createChild() {
    let child = child_process.spawn('node', ['./dist/server.js', env]);
    child.stdout.on('data', function (data) {
        debug(data.toString());
    });

    child.on('exit', function (code) {
        debug('child process exited with code ' + code.toString());
        if(createChild) {
            child = createChild();
        }
    });

    child.on('message', (message) => {
        debug(message);
    });

    return child;
}