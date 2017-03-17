
class RedisCode {
    static redisDecode(txt) {
        let part = txt.split('&');
        let obj = {};
        part.forEach((arg) => {
            let split = arg.split('=');
            obj[split[0]] = split[1];
        });
        return obj;
    }
    static redisEncode(obj) {
        let str = '';
        for(let key in obj) {
            str += '&'+key+'='+obj[key];
        }
        return str.slice(1,str.length);
    }
}

export default RedisCode