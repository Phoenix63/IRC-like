import net from 'net';
import config from './../../../config.json';
import FileReceiver from './FileReceiver';
import bs from 'buffer-split';

let server = net.createServer((socket) => {
    socket.buffer = '';
    socket.filereceiver = null;
    socket.setTimeout(0);

    socket.on('data', (data) => {
        let lines = bs(data, new Buffer('\n')),
            i, line;
        for (i = 0; i < lines.length - 1; i += 1) {
            line = lines[i].toString();
            socket.buffer = '';
            if(!socket.filereceiver) {
                socket.emit('command', line);
            } else {
                socket.emit('file', lines[i]+new Buffer('\n'));
            }
        }
    });
    socket.on('command', (buff) => {
        let command = (buff.match(/FILE [0-9]+ .*/) || [null])[0];
        if(command) {
            let argv = command.split(' ');
            let name = argv[2];
            let size = parseInt(argv[1]);
            if(!isNaN(size)) {
                socket.filereceiver = new FileReceiver(name, size, socket);
            } else {
                console.log('Size error');
            }
        }
    })
    socket.on('file', (buff) => {
        socket.filereceiver.push(buff);
    });

});

server.on('error', (err) => {
    throw err;
});

server.listen(config.image_server.tcpport, config.image_server.ip);