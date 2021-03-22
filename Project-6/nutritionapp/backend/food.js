const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const verifyToken = require("./verify-token");

// schema for food

const foodSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  calories: Number,
  unit: String,
  protein: Number,
  carb: Number,
  fat: Number,
  fibre: Number,
});

const foodModel = new mongoose.model("foods", foodSchema);

let dummyRes = { message: "route test successfull" };

// food routes

router.get("/", verifyToken, async (req, res) => {
  let foods = await foodModel.find();
  res.send({ foods });
});

router.get("/:id", verifyToken, async (req, res) => {
  let id = req.params.id;

  let food = await foodModel.findById(id);
  res.send({ food });
});

router.post("/create", verifyToken, (req, res) => {
  let food = req.body;
  let foodeObj = new foodModel(food);
  foodeObj.save().then(() => {
    res.send({ message: "Food created", code: 1 });
  });
});

router.put("/update/:id", verifyToken, async (req, res) => {
  let id = req.params.id;
  let foodtoUpdate = req.body;

  await foodModel.updateOne({ _id: id }, { $set: foodtoUpdate });
  res.send({ message: "food updated", code: 1 });
});

router.delete("/delete/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  foodModel.deleteOne({ _id: id }).then(() => {
    res.send({ message: "food deleted", code: 1 });
  });
});

module.exports = router;
