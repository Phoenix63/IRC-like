class BufferManager {
    static splitAt(buf, index) {
        if(buf instanceof Buffer) {
            return [buf.slice(0,index), buf.slice(index,buf.length)];
        }

    }

    static split(buf1, buf2) {

        if(!(buf2 instanceof Buffer)) {
            buf2 = new Buffer(buf2);
        }
        if(buf1 instanceof Buffer) {
            let index = buf1.indexOf(buf2);
            let bufs = [];
            while(index >= 0) {
                let split = BufferManager.splitAt(buf1, index);
                if(!split || !split[0]) {
                    break;
                }
                if(!split[0].equals(new Buffer(0))) {
                    bufs.push(split[0]);
                    buf1 = split[1];
                    index = buf1.indexOf(buf2);
                } else {
                    index = buf1.indexOf(buf2)+buf2.length;
                }
            }
            bufs.push(buf1);

            return bufs;
        } else {
            return null;
        }


    }

    static join(arrayBuff, delimiter) {

        if(!(delimiter instanceof Buffer)) {
            delimiter = new Buffer(delimiter);
        }

        if(arrayBuff instanceof Buffer) {
            let buff = new Buffer(0);
            arrayBuff.forEach((buffer) => {
                if(buffer.length > 1) {
                    buff = Buffer.concat([buff, buffer], buff.length+buffer.length+delimiter.length);
                }
            });
            return buff;
        } else {
            return null;
        }


    }

    static contains(buffer, delimiter) {
        if(!(delimiter instanceof Buffer)) {
            delimiter = new Buffer(delimiter);
        }

        if(buffer instanceof Buffer && buffer.indexOf(delimiter) > -1) {
            return true;
        }
        return false;
    }

}

export default BufferManager