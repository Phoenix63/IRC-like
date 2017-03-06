import net from 'net';
import config from './../../../config.json';
import FileReceiver from './FileReceiver';
import bufferManager from './../modules/bufferSpliter';

let server = net.createServer((socket) => {
    socket.buffer = '';
    socket.filereceiver = null;
    socket.r = function() {
        if(socket.filereceiver) {
            return ' socket.receiver is set ';
        } else {
            return '';
        }
    }
    socket.setTimeout(0);

    socket.on('data', (data) => {
        let splited = bufferManager.split(data, '\n');
        socket.pause();
        for(let key in splited) {
            let line = splited[key];
            if(line) {
                let cmd = (line.toString().match(/FILE [0-9]+ .*/) || [null])[0];
                if(cmd) {
                    let argv = line.toString().split(' ');
                    let name = argv[2];
                    let size = parseInt(argv[1]);
                    socket.filereceiver = new FileReceiver(name, size, socket);
                    splited = splited.slice(1,splited.length);
                } else if(socket.filereceiver) {
                    socket.filereceiver.push(line);
                } else {
                    console.log('err: '+line);
                }
            }
        }
        socket.resume();

    });
    socket.on('close', () => {
        console.log('close');
    })
    socket.on('connect', () => {
        console.log('connect');
    })
    socket.on('drain', () => {
        console.log('drain');
    });
    socket.on('end', () => {
        console.log('end');
    });
    socket.on('error', () => {
        console.log('error');
    });
    socket.on('lookup', () => {
        console.log('lookup');
    });
    socket.on('timeout', () => {
        console.log('timeout');
    })

});

server.on('error', (err) => {
    throw err;
});

server.listen(config.image_server.tcpport, config.image_server.ip);