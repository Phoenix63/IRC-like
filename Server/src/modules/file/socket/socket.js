import FileReceiver from './FileReceiver';
import bufferManager from './../modules/bufferSpliter';
import Tcp from './tcp';
import Sio from './sio';
import config from './../../../config.json';

function manage(socket) {
    socket.buffer = '';
    socket.filereceiver = null;

    console.log('new connection from '+(socket.remoteAddress));

    socket.r = function() {
        if(socket.filereceiver) {
            return ' socket.receiver is set ';
        } else {
            return '';
        }
    }
    socket.setTimeout(0);
    socket.buffer = new Buffer(0);

    socket.on('data', (data) => {
        let splited = bufferManager.split(data, '\n');
        for(let key in splited) {
            let line = splited[key];
            if(line) {
                let cmd = (line.toString().match(/FILE [0-9]+ .*/) || [null])[0];
                if(cmd) {
                    let argv = line.toString().split(' ');
                    let name = argv[2];
                    let size = parseInt(argv[1]);
                    if(!isNaN(size) && size > 0 && size <= config.fileSizeLimit) {
                        socket.filereceiver = new FileReceiver(name, size, socket);
                    } else {
                        splited = [];
                        socket.write('FILE LIMITATION ERROR: ('+name+') 0 < size < '+config.fileSizeLimit+'\n');
                        socket.kill();
                    }

                    splited = splited.slice(1,splited.length);
                } else if(socket.filereceiver) {
                    socket.filereceiver.push(line);
                }
            }
        }
    });
}

Tcp.bind((socket) => {
    socket.type = 'TCP';
    manage(socket);
});

Sio.bind((socket) => {
    console.log('new SIO socket');
    socket.type = 'SIO';
    manage(socket);
});