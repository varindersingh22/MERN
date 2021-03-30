const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
const verifyToken = require("./verify-token");
const feedModel = require("./schema_model").feedModel;
const likeModel = require("./schema_model").likeModel;
const commentModel = require("./schema_model").commentModel;
const userModel = require("./schema_model").userModel;

let dummyRes = { message: "route test successfull" };

// routes

// create a feed
router.post("/create", verifyToken, (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, function (err, feed, files) {
    let feedObj = new feedModel(feed);
    feedObj.save().then((data) => {
      let tempPath = files.picture.path;
      let extension = files.picture.name.split(".")[1];
      let newPath = "./feed-pictures/" + data._id + "." + extension;

      fs.rename(tempPath, newPath, function () {
        feed.picture =
          "http://localhost:8000/feed-pictures/" + data._id + "." + extension;

        console.log(feed);

        feedModel.updateOne({ _id: data._id }, { $set: feed }).then(() => {
          res.send({ message: "Feed Uploaded" });
        });
      });
    });
  });
});

// like a feed
router.post("/like", verifyToken, async (req, res) => {
  let like = req.body;

  let alreadyExist = await likeModel
    .find({ feed: like.feed, user: like.user })
    .countDocuments();

  if (alreadyExist > 0) {
    likeModel.deleteOne({ feed: like.feed, user: like.user }).then(() => {
      res.send({ message: "Feed Un-Liked", code: 1 });
    });
  } else {
    let likeObj = new likeModel(like);
    likeObj.save().then(() => {
      res.send({ message: "Feed Liked", code: 1 });
    });
  }
});

// comment on a feed
router.post("/comment", verifyToken, (req, res) => {
  let comment = req.body;
  let commentObj = new commentModel(comment);
  commentObj.save().then(() => {
    res.send({ message: "Comment Added", code: 1 });
  });
});

// fetching comments for a feed
router.get("/comment/:feed_id", verifyToken, async (req, res) => {
  let feed_id = req.params.feed_id;
  let comments = await commentModel
    .find({ feed: feed_id })
    .populate("user")
    .sort({ timestamp: -1 });

  console.log(comments);

  res.send(comments);
});

router.get("/likeusers/:feed_id", verifyToken, async (req, res) => {
  let feed_id = req.params.feed_id;
  let likes = await likeModel.find({ feed: feed_id });
  let user_ids = likes.map((like) => {
    return like.user;
  });
  let users = await userModel.find({ _id: user_ids });
  res.send(users);
});

router.get("/randomfeeds/:user_id", verifyToken, async (req, res) => {
  let user_id = req.params.user_id;
  let feeds = await feedModel.find().populate("user");

  let public_feeds = feeds.filter((feed) => {
    return feed.user.accounttype === "public";
  });

  let random_feeds = [];

  for (let i = 1; i <= 5; i++) {
    let random_index = Math.floor(Math.random() * public_feeds.length);

    let matchCount = 0;

    random_feeds.map((rfeed) => {
      if (rfeed._id.toString() === public_feeds[random_index]._id.toString()) {
        matchCount++;
      }
    });

    if (matchCount === 0) {
      random_feeds.push(public_feeds[random_index]);
    } else {
      i--;
    }
  }

  let feed_ids = random_feeds.map((feed, index) => {
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

  let newFeeds = random_feeds.map((feed, index) => {
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

module.exports = router;
