// predefined modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// custom router module inclusion
const userRouter = require("./users");
const videoRouter = require("./movies");

const app = express();

// mongodb connection

mongoose
  .connect("mongodb://127.0.0.1:27017/netflix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  });

// middlewares
app.use(cors());
app.use(express.json());
app.use("/movies",express.static("videos"));
app.use("/screenshots",express.static("screenshots"));

// redirecting to proper files
app.use("/users", userRouter);
app.use("/video",videoRouter);


// start the server

app.listen(8000);
