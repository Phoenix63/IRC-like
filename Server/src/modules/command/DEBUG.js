"use strict";

let MongoClient = require('mongodb').MongoClient;
import Redis from './../data/RedisInterface';
import config from './../../ENV.json';
let url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
import dbSaver from "../data/dbSaver";

module.exports = function (socket, command) {
    if(command[1].indexOf("--s") > -1){
        Redis.showDBRedis();
    }
    if(command[1].indexOf("--S") > -1){
        MongoClient.connect(url, (err, db) => {
            db.collection('users').find().toArray((err, us) => {
                console.log("----------------------------------------MONGO----------------------------------------");
                console.log("USERS :");
                us.forEach((user) => {
                    let obj = JSON.parse(user.data);
                    for(let key in obj){
                        console.log("\t"+key+"/"+obj[key]);
                    }
                });
                console.log("\n");
            });
            db.collection('channels').find().toArray((err, ch) => {
                console.log("Channels :");
                ch.forEach((channel) => {
                    let obj = JSON.parse(channel.data);
                    for(let key in obj){
                        if(key == "userflags"){
                            console.log("\tUsers Flags :");
                            for(let k in obj[key]){
                                console.log("\t\t"+k+"/"+obj[key][k]);
                            }
                        }else{
                            console.log("\t"+key+"/"+obj[key]);
                        }
                    }
                });
                console.log("-------------------------------------------------------------------------------------");
            })
        });
    }
    if(command[1].indexOf("--d") >-1){
        Redis.flush();
    }
    if(command[1].indexOf("--D") >-1){
        MongoClient.connect(url, (err, db) => {
            db.dropDatabase();
        });
    }
    if(command[1].indexOf("--t") >-1){
        dbSaver(()=>{
            console.log("Transfert redis to mongo");
        });
    }

};
