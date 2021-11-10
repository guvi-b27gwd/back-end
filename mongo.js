const { MongoClient } = require("mongodb");

const mongo = {
  posts: null,
  users: null,
  comments: null,

  async connect() {
    try {
      const client = new MongoClient(process.env.MONGODB_URL);
      await client.connect();
      console.log("Mongo DB Connected Successfully !");

      const db = await client.db(process.env.MONGODB_NAME);
      console.log(`Selected Database - ${process.env.MONGODB_NAME}`);

      //   Initialzing all the Collections
      this.posts = db.collection("posts");
      this.users = db.collection("users");
      this.comments = db.collection("comments");
    } catch (err) {
      console.error("Error connecting to MongoDB");
    }
  },
};

module.exports = mongo;
