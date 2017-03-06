import net from 'net';
import config from './../../../config.json';
import FileReceiver from './FileReceiver';
import bs from './../modules/bufferSpliter';

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
        console.log('------- data --------');
        let splited = bs(data, new Buffer('\n'));
        splited.splice(splited.length-1,1);
        console.log(splited);
        splited.forEach((info) => {
            info = Buffer.concat([info, new Buffer('\n')]);
            let cmd = (info.toString().match(/FILE [0-9]+ .*/) || [null])[0];
            if(cmd) {
                let argv = info.toString().split(' ');
                let name = argv[2];
                let size = parseInt(argv[1]);
                if(!isNaN(size)) {
                    socket.filereceiver = new FileReceiver(name, size, socket);
                } else {
                    console.log('Size error');
                }
            } else if (socket.filereceiver) {
                socket.emit('file', info);
            }
        });
    });
    socket.on('file', (buff) => {
        socket.filereceiver.push(buff);
    });

});

server.on('error', (err) => {
    throw err;
});

server.listen(config.image_server.tcpport, config.image_server.ip);