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
    MongoClient.connect(url, function (err, db) {
        let trigger = new Trigger(() => {
            db.close();
            callback();
        }, 4);
        // drop mongo channel collection
        db.collection('channels', {}, (err, chans) => {
            if(!err) {
                db.dropCollection('channels');
            }
            trigger.perform();
        });
        Redis.getUsers(function (users) {
            if (users) {
                trigger.addAsyncTask(Object.keys(users).length);
                trigger.removeAsyncTask(1);
                for (let key in users) {
                    if (!users.hasOwnProperty(key)) continue;
                    db.collection('users').findOneAndUpdate({identity: key}, {
                        identity: key,
                        data: users[key]
                    }, {upsert: true}, function () {
                        trigger.perform();
                    });
                }
            } else {
                trigger.removeAsyncTask(1);
            }
        });
        Redis.getChannels(function (chans) {
            if (chans) {
                trigger.addAsyncTask(Object.keys(chans).length);
                trigger.removeAsyncTask(1);
                for (let key in chans) {
                    if (!chans.hasOwnProperty(key)) continue;
                    db.collection('channels').findOneAndUpdate({name: key}, {
                        name: key,
                        data: chans[key]
                    }, {upsert: true}, function () {
                        trigger.perform();
                    });
                }
            } else {
                trigger.removeAsyncTask(1);
            }
        });
        Redis.getBannedIP((bans)=>{
            if(bans){
                db.collection('bannedIP').findOneAndUpdate({name: "bannedIP"}, {
                    name: "bannedIP",
                    data: bans
                }, {upsert: true}, function () {
                    trigger.perform();
                });
            }else{
                trigger.removeAsyncTask(1);
            }

        });
    });
};