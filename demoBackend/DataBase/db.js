const mongoose = require("mongoose");

const Db = (db) => {
    mongoose.connect(db, {

        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Server Connected to DataBase");
    });
};

module.exports = Db;