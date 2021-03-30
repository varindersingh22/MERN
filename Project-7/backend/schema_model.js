const mongoose = require("mongoose");

// user schema

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  bio: String,
  accounttype: { type: String, default: "public" },
  profilepicture: {
    type: String,
    default: "http://localhost:8000/profile-pictures/default-avatar.jpg",
  },
  timestamp: { type: Date, default: Date.now },
});

const connectionSchema = new mongoose.Schema({
  influencer: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  follower: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  status: Number,
  timestamp: { type: Date, default: Date.now },
});

// chat schema and model

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  reciever: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// schema for feeds

const feedSchema = new mongoose.Schema({
  picture: String,
  caption: String,
  hashtags: [String],
  tags: [String],
  location: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  likesCount: Number,
  alreadyLiked: Boolean,
  timestamp: { type: Date, default: Date.now },
});

// schema for likes

const likeSchema = new mongoose.Schema({
  feed: { type: mongoose.Schema.Types.ObjectId, ref: "feeds" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  timestamp: { type: Date, default: Date.now },
});

// schema for comments

const commentSchema = new mongoose.Schema({
  feed: { type: mongoose.Schema.Types.ObjectId, ref: "feeds" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  comment: String,
  timestamp: { type: Date, default: Date.now },
});

// model for users
const userModel = new mongoose.model("users", userSchema);
// model for connection
const connectionModel = new mongoose.model("connections", connectionSchema);
// model for chat
const chatModel = new mongoose.model("chats", chatSchema);
// model for feed
const feedModel = new mongoose.model("feeds", feedSchema);
// model for likes
const likeModel = new mongoose.model("likes", likeSchema);
// model for comments
const commentModel = new mongoose.model("comments", commentSchema);

module.exports = {
  userModel: userModel,
  connectionModel: connectionModel,
  chatModel: chatModel,
  feedModel: feedModel,
  likeModel: likeModel,
  commentModel: commentModel,
};
