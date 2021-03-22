// predefined modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// custom router module inclusion
const userRouter = require("./user");
const foodRouter = require("./food");
const activityRouter = require("./activity");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// route middlewares
app.use("/user", userRouter);
app.use("/food", foodRouter);
app.use("/activity", activityRouter);

// start the server

app.listen(8000);
