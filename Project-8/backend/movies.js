const mongoose = require("mongoose");
const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const router = express.Router();
const verifyToken = require("./verify-token");
const videoModel = require("./schemaModels").moviesModel;

// while doing add verify token

router.get("/videos", async (req, res) => {
  let videos = await videoModel.find();
  res.send(videos);
});

// Add Movie
router.post("/movie", (req, res) => {
  let form = new formidable.IncomingForm();

  form.parse(req, function (err,videos, files) {
    let vedioObj = new videoModel(videos);
    vedioObj.save().then((data) => {
      let tempPath = files.videos.path;
      let extension = files.videos.name.split(".")[1];
      let newPath = "./videos/" + data._id + "." + extension;

      fs.rename(tempPath, newPath, function () {
        videos.videos =
          "http://localhost:8000/videos/" + data._id + "." + extension;

        

        vedioModel.updateOne({ _id: data._id }, { $set: videos }).then(() => {
          res.send({ message: "Movie Uploaded" });
        });
      });
    });
  });
});

router.get("/stream/:name", (req, res) => {
  let name = req.params.name;
  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Range header is required");
  }

  const videoPath = "videos/" + name;
  const videoSize = fs.statSync(videoPath).size;

  const chunk_size = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));

  const end = Math.min(start + chunk_size, videoSize - 1);
  const contetLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contetLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
});

module.exports = router;
