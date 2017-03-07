import fs from 'fs';
import config from './../../../config.json';
import shortid from 'shortid';

class FileManager {

    addFile(name, data, callback) {
        fs.writeFile('./__uploaded_files__/'+name, data, 'binary', (err) => {
            if(!err) {
                let url = 'http://'+config.image_server.outip+':'+config.image_server.port+'/public/'+name;
                callback(url);

            }
        });
    }

    static get instance() {
        return instance;
    }
}

const instance = new FileManager();

export default FileManager;