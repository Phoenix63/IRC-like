import sio from 'socket.io';
import config from './../../../config.json';

class Sio {
    static bind(callback) {
        console.log(' --- sio file transfert running');
        let io = sio.listen(config.image_server.sioport);
        io.on('connection', (socket) => {
            socket.emit('connect', null);
            socket.kill = function() {
                socket.disconnect();
            }
            socket.write = function(data) {
                socket.emit('file', data);
            }
            socket.pause = function(){};
            socket.resume = function(){};
            socket.setTimeout = function(){};
            socket.remoteAddress = socket.request.connection.remoteAddress;

            callback(socket);
        });
    }
}

export default Sio
