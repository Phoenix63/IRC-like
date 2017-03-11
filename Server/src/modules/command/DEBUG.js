"use strict";

let MongoClient = require('mongodb').MongoClient;
import Redis from './../data/RedisInterface';
import config from './../../ENV.json';
let url = 'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;
import dbSaver from "../data/dbSaver";
import dbLoader from "../data/dbLoader";

module.exports = function (socket, command) {
    if(process.argv[2] === 'PROD'){
        return;
    }
    //view redis
    if(command[1].indexOf("--vr") > -1){
        Redis.showDBRedis();
    }
    //view mongo
    if(command[1].indexOf("--vm") > -1){
        MongoClient.connect(url, (err, db) => {
            db.collection('users').find().toArray((err, us) => {
                console.log("----------------------------------------MONGO----------------------------------------");
                console.log("USERS :");
                us.forEach((user) => {
                    let obj = JSON.parse(user.data);
                    for(let key in obj){
                        console.log("\t"+key+":"+obj[key]);
                    }
                    console.log("\n");
                });
            });
            db.collection('channels').find().toArray((err, ch) => {
                console.log("Channels :");
                ch.forEach((channel) => {
                    let obj = JSON.parse(channel.data);
                    for(let key in obj){
                        if(key == "usersFlags"){
                            console.log("\tUsers Flags :");
                            for(let k in obj[key]){
                                console.log("\t\t"+k+":"+obj[key][k]);
                            }
                        }else{
                            console.log("\t"+key+":"+obj[key]);
                        }
                    }
                    console.log("\n");
                });
            });
        });

    }
    if(command[1].indexOf("--loadOnMongo") >-1){
        dbSaver(()=>{
            console.log("Transfert redis to mongo");
        });
    }
    if(command[1].indexOf("--loadOnRedis") >-1){
        dbLoader(()=>{
            console.log("Transfert mongo to redis");
        });
    }
    if(command[1].indexOf("--dr") >-1){
        Redis.flush();
        console.log("Redis has been deleted");
    }
    if(command[1].indexOf("--dm") >-1){
        MongoClient.connect(url, (err, db) => {
            db.dropDatabase();
        });
        console.log("Mongo has been deleted");
    }
};
