'use strict';

module.exports = () => {
    const MongoClient = require('mongodb').MongoClient;

    const uri = process.env['DB_CONNECTION_STRING'];
    MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
        console.log('Successfully connected to MongoDB')
       //const collection = client.db("test").collection("devices");
       // perform actions on the collection object
       //client.close();
    });
}

