import config from './../../ENV.json';
import Redis from './RedisInterface';
import Caller from './Caller';
let MongoClient = require('mongodb').MongoClient;
let url;
//For unitTest we use an other DB
if (process.env.RUNNING === 'TEST') {
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.dbtest;
} else {
    url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
}

module.exports = function (callback) {
    let caller = new Caller(callback);
    MongoClient.connect(url, function(err, db) {

        // drop mongo channel collection
        db.collection('channels', {}, (err, chans) => {
            if(!err) {
                db.dropCollection('channels');
            }
        });

        Redis.getUsers(function(users) {
            if (users) {
                for (let key in users) {
                    if (!users.hasOwnProperty(key)) continue;
                    db.collection('users').findOneAndUpdate({identity: key}, {
                        identity: key,
                        data: users[key]
                    }, {upsert: true});
                    caller.incSaved();
                }
            }
            Redis.getChannels(function(chans) {
                caller.toSave = (users?Object.keys(users).length:0) + (chans?Object.keys(chans).length:0);
                if (chans) {
                    for (let key in chans) {
                        if (!chans.hasOwnProperty(key)) continue;
                        db.collection('channels').findOneAndUpdate({name: key}, {
                            name: key,
                            data: chans[key]
                        }, {upsert: true});
                        caller.incSaved();
                    }
                }
            });
        });

    });
};