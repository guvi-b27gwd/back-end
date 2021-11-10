const { ObjectId } = require("mongodb");

const db = require("../mongo");
const { post } = require("../schema");

const service = {
  async find(req, res) {
    try {
      const data = await db.posts.find({ userId: req.user }).toArray();
      res.send(data);
    } catch (err) {
      console.error("Error reading posts", err);
      res.sendStatus(500);
    }
  },
  async create(req, res) {
    try {
      // Validations
      const { error, value } = post.validate(req.body);
      if (error) return res.send({ error: error.details[0].message });

      const { insertedId: _id } = await db.posts.insertOne({
        ...value,
        userId: req.user,
      });
      res.send({ ...value, _id });
    } catch (err) {
      console.error("Error inserting post", err);
      res.sendStatus(500);
    }
  },
  async update(req, res) {
    try {
      // Validations
      const { error, value: val } = post.validate(req.body);
      if (error) return res.send({ error: error.details[0].message });

      const existingPost = await db.posts.findOne({
        _id: ObjectId(req.params.id),
      });
      if (existingPost && existingPost.userId === req.user) {
        const { value } = await db.posts.findOneAndUpdate(
          { _id: ObjectId(req.params.id) },
          { $set: val },
          { returnDocument: "after" }
        );
        res.send(value);
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      console.error("Error updating post", err);
      res.sendStatus(500);
    }
  },
  async delete(req, res) {
    try {
      const post = await db.posts.findOne({ _id: ObjectId(req.params.id) });
      if (post && post.userId === req.user) {
        await db.posts.deleteOne({ _id: ObjectId(req.params.id) });
        res.send({});
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      console.error("Error deleting post", err);
      res.sendStatus(500);
    }
  },
};

module.exports = service;
