const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
    path: "./config.env"
});
const GlobalError = require("./error/GlobalError");
const errorHandler = require("./error/errorHandler");

//!Routers:
const userRouter = require("./routes/userRouter");

//! my app
const app = express();

app.use(cors());
app.use(express.json());

//! using morgan at development mode
if (process.env.NODE_ENV.trim() == "development") {
    app.use(morgan("dev"));
};

//! routers
app.use("/api/v1/user", userRouter);

//! throwing error when route does not exist
app.use((req, res, next) => {
    next(new GlobalError(`${req.originalUrl} does not exist!`, 500));
});

//! Global Error Handler
app.use(errorHandler);

const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected");

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});