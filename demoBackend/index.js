const app = require("./app");
const dataBase = require('./DataBase/db');
const dotenv = require('dotenv');

dotenv.config();


//connecting to DataBase  and server

const db = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
const port = process.env.PORT;
const server = async () => {
    await dataBase(db);
    app.listen(port, () => {

        console.log("server is listening")

    })
};

server();
