const mongoose = require("mongoose");
const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const verifyToken = require("./verify-token");
const userModel = require("./schema_model").userModel;
const connectionModel = require("./schema_model").connectionModel;
const feedModel = require("./schema_model").feedModel;
const likeModel = require("./schema_model").likeModel;

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

// fething the followers,influencers,user personal feeds

router.get("/profile/:username", verifyToken, async (req, res) => {
  let username = req.params.username;
  let user = await userModel.findOne({ username: username });
  let user_id = user._id;
  // fetching the followers
  let followers = await connectionModel
    .find({ influencer: user_id })
    .populate("follower");

  let influencers = await connectionModel
    .find({ follower: user_id })
    .populate("influencer");

  let feeds = await feedModel.find({ user: user_id }).populate("user");

  let feed_ids = feeds.map((feed, index) => {
    return feed._id;
  });

  let likes = await likeModel.aggregate([
    {
      $match: { feed: { $in: feed_ids } },
    },
    {
      $group: {
        _id: "$feed",
        docs: { $push: "$$ROOT" },
      },
    },
  ]);

  let newFeeds = feeds.map((feed, index) => {
    let likeRecords = likes.filter((like) => {
      return like._id.toString() == feed._id.toString();
    });

    if (likeRecords.length != 0) {
      let checkForLike = likeRecords[0].docs.filter((doc) => {
        return doc.user.toString() === user_id.toString();
      });

      if (checkForLike.length > 0) {
        feed.alreadyLiked = true;
      } else {
        feed.alreadyLiked = false;
      }

      feed.likesCount = likeRecords[0].docs.length;
    }

    return feed;
  });

  res.send({
    followers: followers,
    influencers: influencers,
    feeds: newFeeds,
    user: user,
  });
});

// fethc feeds of all the influencers that users follows and also the number of likes for the feed

router.get("/home/:id", verifyToken, async (req, res) => {
  let user_id = req.params.id;

  let influencers = await connectionModel.find({ follower: user_id });

  let influencer_ids = influencers.map((inf, index) => {
    return inf.influencer;
  });

  influencer_ids.push(user_id);

  let feeds = await feedModel
    .find({ user: influencer_ids })
    .populate("user")
    .sort({ timestamp: -1 });

  let feed_ids = feeds.map((feed, index) => {
    return feed._id;
  });

  let likes = await likeModel.aggregate([
    {
      $match: { feed: { $in: feed_ids } },
    },
    {
      $group: {
        _id: "$feed",
        docs: { $push: "$$ROOT" },
      },
    },
  ]);

  let newFeeds = feeds.map((feed, index) => {
    let likeRecords = likes.filter((like) => {
      return like._id.toString() == feed._id.toString();
    });

    if (likeRecords.length != 0) {
      // checing for personal like
      let checkForLike = likeRecords[0].docs.filter((doc) => {
        return doc.user.toString() === user_id.toString();
      });

      if (checkForLike.length > 0) {
        feed.alreadyLiked = true;
      } else {
        feed.alreadyLiked = false;
      }

      feed.likesCount = likeRecords[0].docs.length;
    }

    return feed;
  });

  res.send(newFeeds);
});

router.put("/update/:id", verifyToken, async (req, res) => {
  let form = new formidable.IncomingForm();
  let user_id = req.params.id;
  console.log(user_id);
  form.parse(req, function (err, user, files) {
    if (files.profilepicture === undefined) {
      console.log(user);
      userModel.update({ _id: user_id }, { $set: user }).then(() => {
        res.send({ message: "Profile Updated" });
      });
    } else {
      let tempPath = files.profilepicture.path;
      let extension = files.profilepicture.name.split(".")[1];
      let newPath = "./profile-pictures/" + user_id + "." + extension;

      fs.rename(tempPath, newPath, function () {
        user.profilepicture =
          "http://localhost:8000/profile-pictures/" + user_id + "." + extension;

        userModel.update({ _id: user_id }, { $set: user }).then(() => {
          res.send({ message: "Profile Updated" });
        });
      });
    }
  });
});

router.get("/me/:id", verifyToken, async (req, res) => {
  let id = req.params.id;
  let me = await userModel.find({ _id: id });
  res.send(me);
});

// to follow
router.post("/connection/create", verifyToken, async (req, res) => {
  let connection = req.body;
  let influencer = await userModel.findOne({ _id: connection.influencer });
  let message = "";
  if (influencer.accounttype === "private") {
    connection.status = 1;
    message = "Request Sent";
  } else {
    connection.status = 0;
    message = "Follow Successfull";
  }

  let connectionObj = new connectionModel(connection);
  connectionObj.save().then(async (connection) => {
    let connectionWithFollower = await connectionModel
      .findOne({ _id: connection._id })
      .populate("follower");

    res.send({ message: message, code: 1, connection: connectionWithFollower });
  });
});

// to act upon follow request if the account is private
router.post("/connection/action", verifyToken, async (req, res) => {
  let connectionAction = req.body;
  let message = "";
  if (connectionAction.action === "accept") {
    await connectionModel.updateOne(
      { _id: connectionAction.connection },
      { $set: { status: 0 } }
    );
    message = "Request Accepted";
  } else if (connectionAction.action === "delete") {
    await connectionModel.deleteOne({ _id: connectionAction.connection });
    message = "Request Deleted";
  }

  res.send({ message: message, code: 1 });
});

// to unfollow
router.delete(
  "/connection/delete/:connection_id",
  verifyToken,
  async (req, res) => {
    let connection_id = req.params.connection_id;

    await connectionModel.deleteOne({ _id: connection_id });
    res.send({ message: "unfollowed", code: 1 });
  }
);

module.exports = router;
