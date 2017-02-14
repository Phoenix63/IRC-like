
import Caller from './Caller';

let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');

import Redis from './RedisInterface';
let redis = Redis.instance;

var url = 'mongodb://'+config.mongo.user+':'+config.mongo.pass+'@'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db+config.mongo.method;

/**
 * if bool is set to true we flush redis
 * @param bool
 * @param callback
 */
module.exports = function(bool, callback) {
    MongoClient.connect(url, (err, db) => {

        let caller = new Caller(() => {
            db.close();
            callback();
        });

        redis.getUsers((users) => {
            for(let i = 0; i<Object.keys(users).length; i++) {
                //console.log('user: '+(i+1)+'/'+Object.keys(users).length);
                db.collection('users').findOneAndUpdate({identity: Object.keys(users)[i]}, {identity: Object.keys(users)[i], pass: users[Object.keys(users)[i]]}, {upsert:true}).then(() => {
                    caller.incSaved();
                });
            }
            redis.getAdmin((admins) => {
                caller.toSave = Object.keys(users).length + Object.keys(admins).length;
                for(let j = 0; j<Object.keys(admins).length; j++) {
                    //console.log('admin: '+(j+1)+'/'+Object.keys(admins).length);
                    db.collection('admin').findOneAndUpdate({name: Object.keys(admins)[j]},{name: Object.keys(admins)[j]},{upsert:true}).then(() => {
                        caller.incSaved();
                    });
                }
            });
        });
    });
};