import httpServer from './http/app';
import tcpServer from './socket/socket';
import redisLib from 'redis';
import conf from './../../ENV.json';
import redisCode from './modules/RedisCode';

let redis = redisLib.createClient({host: conf.redis.host, port:conf.redis.port});

redis.subscribe('fileserver');
console.log(' - file server subscribe to [fileserver] -');

redis.on('message', (chan, message) => {
    if(chan === 'fileserver') {
        let obj = redisCode.redisDecode(message);
    }
});