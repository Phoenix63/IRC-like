import FileManager from './../http/FileManager';
import config from './../../../config.json';
import shortid from 'shortid';
var debug = require('debug')('fileserver:filereceiver');

class FileReceiver {
    constructor(name, size, socket, callback = function(){}) {
        debug('New file arrive');
        this._size = size;
        this._data = [];
        this._currentSize = 0;
        this._name = shortid.generate() + '.'+name;
        this._socket = socket;
        this._full = callback
    }

    _success() {
        this._socket.filereceiver = null;
        this._socket.pause();
        debug('success');
        let data = Buffer.concat(this._data);
        FileManager.instance.addFile(this._name, data, (url) => {
            this._socket.write(':'+config.ip+' FILE :'+url+'\n');
            debug('file up at :'+url);
            this._socket.resume();
        });
    }

    push(data) {
        this._currentSize += data.length;
        this._data.push(data);
        if(process.env.ENV === 'DEV') {
            debug('FILE TRANSFERT:'+this._currentSize+'/'+this._size);
        }
        this._socket.write(':'+config.ip+' FILE TRANSFERT :'+this._currentSize+'/'+this._size+'\n');

        if(this._currentSize >= this._size) {
            this._full();
            this._success();
        }
    }

    get percent() {
        return Math.ceil((this._currentSize/this._size)*100);
    }
    get done() {
        return this._currentSize+'/'+this._size;
    }
}

export default FileReceiver;