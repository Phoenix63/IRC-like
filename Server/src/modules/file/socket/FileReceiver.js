import FileManager from './../http/FileManager';
import config from './../../../config.json';
import shortid from 'shortid';

class FileReceiver {
    constructor(name, size, socket, callback = function(){}) {
        console.log('New file arrive');
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
        console.log('success');
        let data = Buffer.concat(this._data);
        FileManager.instance.addFile(this._name, data, (url) => {
            this._socket.write(':'+config.ip+' FILE :'+url+'\n');
            console.log('file up at :'+url);
            this._socket.resume();
        });
    }

    push(data) {
        this._currentSize += data.length;
        this._data.push(data);
        if(process.env.ENV === 'DEV') {
            console.log('FILE TRANSFERT:'+this._currentSize+'/'+this._size);
        }

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