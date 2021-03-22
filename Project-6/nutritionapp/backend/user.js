const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const verifyToken = require("./verify-token");

// schema for users

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  country: String,
  age: Number,
  weight: Number,
  role: String,
  approved: Boolean,
});

const userFoodSchema = new mongoose.Schema({
  date: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  food: { type: mongoose.Schema.Types.ObjectId, ref: "foods" },
  amount: Number,
  unit: String,
});

const userActivitySchema = new mongoose.Schema({
  date: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "activities" },
  time: Number,
});

// model for userActivity
const userActivityModel = new mongoose.model(
  "useractivity",
  userActivitySchema
);
// model for userfood
const userFoodModel = new mongoose.model("userfood", userFoodSchema);
// model for users
const userModel = new mongoose.model("users", userSchema);

let dummyRes = { message: "route test successfull" };

// key for password encryption
let salt = "secretkey";
let tokenKey = "tokenkey";

// mongo db connection

mongoose
  .connect("mongodb://127.0.0.1:27017/nutrition", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  });

router.get("/", verifyToken, async (req, res) => {
  let users = await userModel.find();
  res.send({ users });
});

router.post("/register", (req, res) => {
  let user = req.body;
  user.password = crypto
    .pbkdf2Sync(user.password, salt, 1000, 64, "sha512")
    .toString("hex");

  let userObj = new userModel(user);
  userObj.save().then(() => {
    res.send({ message: "User Registered", code: 1 });
  });
});

router.post("/login", async (req, res) => {
  let userCredentials = req.body;
  userCredentials.password = crypto
    .pbkdf2Sync(userCredentials.password, salt, 1000, 64, "sha512")
    .toString("hex");

  let userCount = await userModel.find(userCredentials).countDocuments();

  if (userCount == 1) {
    let userInfo = await userModel.findOne(userCredentials);

    jwt.sign(userCredentials, tokenKey, (err, token) => {
      if (err != null) {
        res.send({ message: "Some problem try after some time", code: 0 });
      } else {
        res.send({ token: token, user: userInfo, code: 1 });
      }
    });
  } else {
    res.send({ message: "wrong username or password", code: 0 });
  }
});

router.get("/logout", (req, res) => {
  res.send(dummyRes);
});

router.put("/update/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  userModel.updateOne({ _id: id }, { $set: updateUser }).then(() => {
    res.send({ message: "updated user", code: 1 });
  });
});

router.get("/me", verifyToken, async (req, res) => {
  let me = await userModel.find({ email: req.user.email });
  res.send(me);
});

// route for userfood
router.post("/userfood", verifyToken, (req, res) => {
  let fooduser = req.body;
  let fooduserObj = new userFoodModel(fooduser);

  fooduserObj.save().then(() => {
    res.send({ message: "Food Added", code: 1 });
  });
});

router.get("/userfood/:user_id/:date", verifyToken, async (req, res) => {
  let user_id = req.params.user_id;
  let date = req.params.date;
  let userfoods = await userFoodModel
    .find({ user: user_id, date: date })
    .populate("user")
    .populate("food");
  res.send({ userfoods });
});

// route for user activities

router.post("/useractivity", verifyToken, (req, res) => {
  let useractivity = req.body;
  let useractivityObj = new userActivityModel(useractivity);
  useractivityObj.save().then(() => {
    res.send({ message: "User Activity Added", code: 1 });
  });
});

router.get("/useractivity/:user_id/:date", verifyToken, async (req, res) => {
  let user_id = req.params.user_id;
  let date = req.params.date;
  let activities = await userActivityModel
    .find({ user: user_id, date: date })
    .populate("user")
    .populate("activity");
  res.send({ activities });
});

module.exports = router;
