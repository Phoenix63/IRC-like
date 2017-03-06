import FileManager from './../http/FileManager';
import config from './../../../config.json';

class FileReceiver {
    constructor(name, size, socket) {
        console.log('New file arrive');
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
        let data = Buffer.concat(this._data);
        FileManager.instance.addFile(this._name, data, (url) => {
            this._socket.write(':'+config.ip+' FILE :'+url+'\n');
            this._socket.resume();
        });
    }

    push(data) {
        this._data.push(data);
        this._currentSize += data.length;
        console.log(this.done+' ('+this.percent+'%)');
        if(this._currentSize >= this._size) {
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