import config from './../../../config.json';
import net from 'net';

class TcpCreator {

    static bind(callback) {
        console.log(' --- tcp file transfert running');
        this._server = net.createServer((socket) => {
            socket.kill = function() {
                socket.destroy();
            }
            callback(socket);
        });
        this._server.listen(config.image_server.tcpport, config.image_server.ip);
    }
}

export default TcpCreator
