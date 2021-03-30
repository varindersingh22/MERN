const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const verifyToken = require("./verify-token");
const chatModel = require("./schema_model").chatModel;
const userModel = require("./schema_model").userModel;

let dummyRes = { message: "route test successfull" };

// to create a chat message

router.post("/create", verifyToken, (req, res) => {
  let chat = req.body;
  let chatObj = new chatModel(chat);
  chatObj.save().then(() => {
    res.send({ message: "chat created", code: 1 });
  });
});

router.get("/chats/:user1_id/:user2_id", verifyToken, async (req, res) => {
  let user1_id = req.params.user1_id;
  let user2_id = req.params.user2_id;

  let chats = await chatModel.find({
    $or: [
      { sender: user1_id, reciever: user2_id },
      { sender: user2_id, reciever: user1_id },
    ],
  });

  res.send(chats);
});

router.get("/conversation/:user_id", verifyToken, async (req, res) => {
  let user_id = req.params.user_id;

  let recievers = await chatModel.distinct("reciever", { sender: user_id });

  let senders = await chatModel.distinct("sender", { reciever: user_id });

  let combinedUser_ids = recievers.concat(senders);

  let user_ids = [];

  for (let i = 0; i < combinedUser_ids.length; i++) {
    let p = user_ids.find((user_id) => {
      return user_id.toString() === combinedUser_ids[i].toString();
    });

    if (p == null) {
      user_ids.push(combinedUser_ids[i]);
    }
  }

  let users = await userModel.find({ _id: user_ids });

  res.send(users);
});

// router.delete("/delete/:chat_id", verifyToken, (req, res) => {
//   let chat_id = req.params.id;
//   chatModel.deleteOne({ _id: chat_id }).then(() => {
//     res.send({ message: "chat deleted" });
//   });
// });

module.exports = router;
