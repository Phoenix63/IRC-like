var debug = require('debug')('server:nodemon');
var nodemon = require('nodemon');

process.title = 'servernodemon';

nodemon('--ignore ./src/modules/file --ignore ./__uploaded_files__ --exec babel-node ./src/server.js DEV');
nodemon.on('start', () => {
    debug('\x1b[33m app started \x1b[0m');
}).on('quit', () => {
    debug('\x1b[33m app quit \x1b[0m');
}).on('restart', () => {
    debug('\x1b[33m app restart \x1b[0m');
})