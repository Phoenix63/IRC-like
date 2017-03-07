import config from './../../../config.json';
import net from 'net';

class TcpCreator {

    static bind(callback) {
        this._server = net.createServer((socket) => {
            callback(socket);
        });
        this._server.listen(config.image_server.tcpport, config.image_server.ip);
    }
}

export default TcpCreator
