const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes");

const middleware = require("./middleware");
const mongo = require("./mongo");

const app = express();

(async () => {
  try {
    // MongoDB Connections
    await mongo.connect();

    // Middlewares
    app.use(cors());
    app.use(express.json()); // Parsing Request Body As JSON Format
    app.use(middleware.logging); // Logging All Requests

    // Routes
    app.use("/auth", authRoutes);

    // Check token exists
    app.use((req, res, next) => {
      if (req.headers["authorization"]) {
        const token = req.headers["authorization"].split(" ")[1];
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          req.user = user.userId;
          next();
        } catch (err) {
          res.sendStatus(403);
        }
      } else {
        res.sendStatus(403);
      }
    });

    app.use("/posts", postsRoutes);

    app.listen(process.env.PORT, () => {
      console.log(`Server listening at port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Error starting app", err);
  }
})();
