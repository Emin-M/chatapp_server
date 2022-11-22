const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
    path: "./config.env"
});

//! my app
const app = express();

app.use(cors());
app.use(express.json());

//! Environment
if (process.env.NODE_ENV.trim() == "development") {
    app.use(morgan("dev"));
};

const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected");

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});