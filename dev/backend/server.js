const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const mongoose = require("mongoose");
const mongoConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "local",
};
mongoose.connect(
  `mongodb://${mongoConnData.host}:${mongoConnData.port}/${mongoConnData.database}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);
const commentSchema = new mongoose.Schema({
  title: { type: String, required: true },
});
const Comment = mongoose.model("Comment", commentSchema);

const Redis = require("ioredis");
const redisConnData = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
};
const redis = new Redis({
  host: redisConnData.host,
  port: redisConnData.port,
});
redis.on("error", (err) => console.log(err));

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(cors());

// Mongo
app.get("/mongo/comments", async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.send(comments);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/mongo/comment", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.send(comment);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/mongo/comment/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    !comment ? res.status(404).send("No item found") : res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

// Redis
app.get("/redis/comments", async (req, res) => {
  try {
    const comments = await redis.hgetall("comments");
    res.send(Object.entries(comments).map((e) => ({ id: e[0], title: e[1] })));
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/redis/comment", async (req, res) => {
  try {
    const id = uuid();
    redis.hset("comments", id, req.body.title);
    res.send({
      id: id,
      title: req.body.title,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/redis/comment/:id", async (req, res) => {
  try {
    const comment = await redis.hdel("comments", req.params.id);
    !comment ? res.status(404).send("No item found") : res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
