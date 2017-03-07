import httpServer from './http/app';
import tcpServer from './socket/socket';

if(process.argv[2]) {
    process.env.ENV = process.argv[2];
} else {
    process.env.ENV = 'PROD';
}