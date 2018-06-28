const mongoose = require('mongoose');
 
module.exports = {
    initialize: () => {
        let db = mongoose.connection;

        db.on("error", console.error.bind(console, "connection error:"));

        db.once("open", () => {
            console.log("Succesfully connected to mongoDB \n----");
        });

        mongoose.connect(process.env['DB_CONNECTION_STRING']);
    }
};
