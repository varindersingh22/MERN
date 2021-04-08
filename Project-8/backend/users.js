const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const verifyToken = require("./verify-token");
const userModel = require("./schemaModels").userModel;



let dummyRes = { message: "route test successfull" };

// key for password encryption
let salt = "secretkey";
let tokenKey = "tokenkey";

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

// get all users for search

router.get("/users", verifyToken, async (req, res) => {
  let users = await userModel.find();
  res.send(users);
});

router.put("/update/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  userModel.updateOne({ _id: id }, { $set: updateUser }).then(() => {
    res.send({ message: "updated user", code: 1 });
  });
});




module.exports = router;
