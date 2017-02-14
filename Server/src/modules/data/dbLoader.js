
let MongoClient = require('mongodb').MongoClient;
let config = require('./../../ENV.json');

import Redis from './RedisInterface';
let redis = Redis.instance;

var url = 'mongodb://'+config.mongo.user+':'+config.mongo.pass+'@'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.db+config.mongo.method;

module.exports = function(callback) {
      MongoClient.connect(url, (err, db) => {
            let users = db.collection('users');
            users.find().toArray((err, obj) => {
                 obj.forEach((user) => {
                     redis.addUser(user.identity, user.pass);
                 });
            });

            let admin = db.collection('admin');
            admin.find().toArray((err, obj) => {
                obj.forEach((tuple) => {
                    redis.setAdmin({identity: tuple.name});
                });
            });
            db.close();
            callback();
      });
};