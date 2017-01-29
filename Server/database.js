var mongodb = require('mongodb');

module.exports = DataBase;

function DataBase(){
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/sampsite';

    MongoClient.connect(url, function(err,db){
       if(err){
           console.log('Unable to connect to the server');
       } else {
           console.log("Connection Established");
           var collection = db.collection('students');
           collection.find({}).toArray(function(err, result){
               if(result.length){
                   console.log(result);
               }
           })
       }

    });
};