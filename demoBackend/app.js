const express = require("express");

const helmet = require("helmet");
const cors = require("cors");
const bodyParse = require('body-parser');



const Authrouter = require("./Routers/Authrouter");
const morgan = require("morgan");

const app = express()

app.use(express.json())

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParse.json({ limit: '20mb', extended: true }));
app.use(bodyParse.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());
// app.use(cors({ credentials: true, origin: 'http://127.0.0.1:5173/' }));

app.use("/api", Authrouter);

module.exports = app