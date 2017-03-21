let spawn = require('child_process').spawn;
let debug = require('debug')('pandirc:runner');
import colors from './lib/util/Color';

process.env.RUNNING = process.env.RUNNING || 'PROD';

let child = null;

function _start() {

    debug('rebuilding files...');
    let build = spawn('npm', ['run', 'build']);

    build.on('close', () => {

        debug('rebuilding success!');
        child = spawn('node', ['./dist/run.js'], {
            RUNNING: process.env.RUNNING,
            DEBUG:process.env.DEBUG
        });

        debug('running server ('+process.env.RUNNING+')...');

        child.stdout.on('data', function (data) {
            data.toString().split('\n').map((data) => {
                if(data.toString().trim() !== '') {
                    let d = data.toString()
                        .replace(/[A-Za-z]+, [0-9]+ [A-Za-z]+ [0-9]+ /g, '').replace(' GMT','');
                    let date = d.slice(0,d.indexOf(' '));
                    let head = d.replace(date+' ', '');
                    head = head.slice(0, head.indexOf(' '));
                    let message = d.replace(date+' ', '').replace(head+' ', '');

                    process.stdout.write(
                        colors.green(date)+':'+colors.yellow(head)+'\t\t'+message+'\n'
                    );
                }
            })

        });

        child.stderr.on('data', function (data) {
            data.toString().split('\n').map((data) => {
                if(data.toString().trim() !== '') {
                    let d = data.toString()
                        .replace(/[A-Za-z]+, [0-9]+ [A-Za-z]+ [0-9]+ /g, '').replace(' GMT','');
                    let date = d.slice(0,d.indexOf(' '));
                    let head = d.replace(date+' ', '');
                    head = head.slice(0, head.indexOf(' '));
                    let message = d.replace(date+' ', '').replace(head+' ', '');

                    process.stdout.write(
                        colors.green(date)+':'+colors.yellow(head)+'\t\t'+message+'\n'
                    );
                }
            })
        });

        child.on('close', function (code) {
            debug("Finished with code " + code);
            if(!code || code === 15 || code === 1) {
                if(process.env.RUNNING !== 'TEST') {
                    _start();
                } else {
                    process.exit();
                }
            } else {
                process.exit(0);
            }
        });
    });



}

_start();

process.on('SIGINT', function() {
    if(child) {
        child.kill('SIGINT');
    }
});