import config from './../../ENV.json';
import Redis from './RedisInterface';
import Trigger from './Trigger';
let MongoClient = require('mongodb').MongoClient;
let url;
//For unitTest we use an other DB
if(process.argv[2] === 'TEST'){
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbtest;
}else{
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
}

module.exports = function(callback) {
    Trigger.setCallback(callback);
    MongoClient.connect(url, (err, db) => {
        Redis.getUsers((users) => {
            if(users){
                for(let i = 0; i<Object.keys(users).length; i++) {
                    db.collection('users').findOneAndUpdate({identity: Object.keys(users)[i]}, {identity: Object.keys(users)[i], data:users[Object.keys(users)[i]]}, {upsert:true});
                }
            }
            Trigger.update();
        });
        Redis.getChannels((chans) => {
            if(chans){
                for(let k = 0; k<Object.keys(chans).length; k++) {
                    db.collection('channels').findOneAndUpdate({name: Object.keys(chans)[k]}, {name: Object.keys(chans)[k], data:chans[Object.keys(chans)[k]]}, {upsert: true});
                }
            }
            Trigger.update();
        });
    });
};