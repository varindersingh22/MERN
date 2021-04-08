const mongoose = require("mongoose");

// schema for users

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    profilepicture: {
      type: String,
      default: "http://localhost:8000/profile-pictures/default-avatar.jpg",
    },
    timestamp: { type: Date, default: Date.now },
  });
  
//schema for movies
const moviesSchema = new mongoose.Schema({
    title:String,
    screenshot:String,
    timestamp: { type: Date, default: Date.now },
    category: String,
    info:{
        directed_by:String,
        releaseDate:Number,
        LeadActor:String,
        description:String
    },
    category:String,
    universe:String,
    vediolink:String
})

// model for users
const userModel = new mongoose.model("users", userSchema);
//model for movies
const moviesModel= new mongoose.model("movies",moviesSchema);

module.exports={
    userModel: userModel,
    moviesModel:moviesModel,
};