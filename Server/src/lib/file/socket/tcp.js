import config from './../../../config.json';
import net from 'net';
let debug = require('debug')('fileserver:tcp');

class TcpCreator {

    static bind(callback) {
        debug(' --- tcp file transfert running');
        this._server = net.createServer((socket) => {
            socket.kill = function() {
                socket.destroy();
            }

            socket.on('error', () => {
                debug('socket error');
            })
            socket.on('close', () => {
                debug('socket close');
            });
            socket.on('end', () => {
                debug('socket end');
            });
            callback(socket);
        });
        this._server.listen(config.image_server.tcpport, config.image_server.ip);
    }
}

export default TcpCreator
