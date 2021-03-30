// predefined modules
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const chatModel = require("./schema_model").chatModel;

// custom router module inclusion
const userRouter = require("./user");
const feedRouter = require("./feed");
const chatRouter = require("./chat");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// mongodb connection

mongoose
  .connect("mongodb://127.0.0.1:27017/picshares", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  });

// middlewares
app.use(cors());
app.use(express.json());
app.use("/profile-pictures", express.static("profile-pictures"));
app.use("/feed-pictures", express.static("feed-pictures"));

// redirecting to proper files
app.use("/user", userRouter);
app.use("/feed", feedRouter);
app.use("/chat", chatRouter);

// socket channel work

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on("send-message", (chat) => {
    let chatObj = new chatModel(chat);
    chatObj.save().then(() => {});
    socket.broadcast.to(chat.reciever).emit("recieve-message", chat);
  });
});

// start the server

// before socket
// app.listen(8000);

// after socket

server.listen(8000);
