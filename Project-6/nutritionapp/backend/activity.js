const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const verifyToken = require("./verify-token");

// schema for activities

const activitySchema = new mongoose.Schema({
  name: String,
  met: Number,
});

const activityModel = new mongoose.model("activities", activitySchema);

let dummyRes = { message: "route test successfull" };

// routes

router.get("/", verifyToken, async (req, res) => {
  let activities = await activityModel.find();
  res.send({ activities });
});

router.get("/:id", verifyToken, async (req, res) => {
  let id = req.params.id;
  let activity = await activityModel.findOne({ _id: id });
  res.send({ activity });
});

router.post("/create", verifyToken, (req, res) => {
  let activity = req.body;

  let activityObj = new activityModel(activity);
  activityObj.save().then(() => {
    res.send({ message: "Activity Created" });
  });
});

router.put("/update/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  let activityToUpdate = req.body;

  console.log(id, activityToUpdate);

  activityModel.updateOne({ _id: id }, { $set: activityToUpdate }).then(() => {
    res.send({ message: "activity updated", code: 1 });
  });
});

router.delete("/delete/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  activityModel.deleteOne({ _id: id }).then(() => {
    res.send({ message: "activity deleted", code: 1 });
  });
});

module.exports = router;
