module.exports = exports = (buf1, buf2) => {
    let bufs = [];
    let index = buf1.indexOf(buf2);
    while(index >= 0) {
        console.log(index);
        bufs.push(buf1.slice(0, index));
        buf1 = buf1.slice(index+buf2.length, buf1.length);
        console.log(buf1);
        index = buf1.indexOf(buf2);
    }
    bufs.push(buf1);
    return bufs;
}