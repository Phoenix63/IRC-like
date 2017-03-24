import httpServer from './http/app';
import tcpServer from './socket/socket';

process.title = 'pandirc:fileserver'

if(process.env.RUNNING) {
    process.env.ENV = process.env.RUNNING;
} else {
    process.env.ENV = 'PROD';
}

process.on('SIGINT', () => {
    process.exit(2);
});
process.on('SIGTERM', () => {
    process.exit(15);
});