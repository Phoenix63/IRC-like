import sio from 'socket.io';
import config from './../../../config.json';

class Sio {
    static bind(callback) {
        let io = sio.listen(config.image_server.sioport);
        io.on('connection', (socket) => {
            socket.write = function(data) {
                socket.emit('file', data);
            }
            socket.setTimeout = function(){};
            socket.remoteAddress = socket.request.connection.remoteAddress;

            callback(socket);
        });
    }
}

export default Sio
