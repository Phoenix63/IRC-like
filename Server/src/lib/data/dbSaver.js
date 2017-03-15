import config from './../../ENV.json';
import Redis from './RedisInterface';
import Trigger from './Trigger';
let MongoClient = require('mongodb').MongoClient;
let url;
//For unitTest we use an other DB
if (process.env.RUNNING === 'TEST') {
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbtest;
} else {
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
}

module.exports = function (callback) {
    Trigger.setCallback(callback);
    MongoClient.connect(url, (err, db) => {
        Redis.getUsers((users) => {
            if (users) {
                for (let key in users) {
                    if (!users.hasOwnProperty(key)) continue;
                    db.collection('users').findOneAndUpdate({identity: key}, {
                        identity: key,
                        data: users[key]
                    }, {upsert: true});
                }
            }
            Trigger.update();
        });
        Redis.getChannels((chans) => {
            if (chans) {
                for (let key in chans) {
                    if (!chans.hasOwnProperty(key)) continue;
                    db.collection('channels').findOneAndUpdate({name: key}, {
                        name: key,
                        data: chans[key]
                    }, {upsert: true});
                }
            }
            Trigger.update();
        });
    });
};