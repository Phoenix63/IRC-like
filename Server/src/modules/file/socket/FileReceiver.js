import FileManager from './../http/FileManager';
import bs from 'buffer-split';

class FileReceiver {
    constructor(name, size, socket) {
        this._size = size;
        this._data = [];
        this._currentSize = 0;
        this._name = name;
        this._socket = socket;
    }

    _success() {
        this._socket.filereceiver = null;
        this._socket.pause();
        console.log('success');
        let data = this._data.join('');
        this._data = [];
        FileManager.instance.addFile(this._name, data, (url) => {
            this._socket.write(url+'\n');
            this._socket.resume();
        });

    }

    push(data) {
        this._data.push(data);
        this._currentSize += data.length;
        console.log(this._currentSize+' / '+this._size);
        if(this._currentSize >= this._size) {
            if(this._currentSize > this._size) {

            }
            this._success();
        }
    }
}

export default FileReceiver;