let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');
import Redis from './RedisInterface';
import Trigger from './Trigger';
var url = 'mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db;


module.exports = function(callback) {
    Trigger.setCallback(callback);
    MongoClient.connect(url, (err, db) => {
        Redis.getUsers((users) => {
            if(users){
                for(let i = 0; i<Object.keys(users).length; i++) {
                    console.log("debug :" + Object.keys(users)[i] + "/" + users[Object.keys(users)[i]]);
                    db.collection('users').findOneAndUpdate({identity: Object.keys(users)[i]}, {identity: Object.keys(users)[i], data:users[Object.keys(users)[i]]}, {upsert:true});
                }
            }
            Trigger.update();
        });
        Redis.getChannels((chans) => {
            if(chans){
                for(let k = 0; k<Object.keys(chans).length; k++) {
                    console.log("debug :" + Object.keys(chans)[k] + "/" + chans[Object.keys(chans)[k]]);
                    db.collection('channels').findOneAndUpdate({name: Object.keys(chans)[k]}, {name: Object.keys(chans)[k], data:chans[Object.keys(chans)[k]]}, {upsert: true});
                }
            }
            Trigger.update();
        });
    });
};