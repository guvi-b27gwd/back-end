const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../mongo");
const { register, login } = require("../schema");

const service = {
  async register(req, res) {
    try {
      // Validations
      const { error, value } = register.validate(req.body);
      if (error) return res.send({ error: error.details[0].message });

      value.email = value.email.toLowerCase();

      //   Check if user already exists
      const user = await db.users.findOne({ email: value.email });
      if (user) return res.sendStatus(400);

      //   Encrypt the password
      const salt = await bcrypt.genSalt();
      value.password = await bcrypt.hash(value.password, salt);

      // Insert user to DB
      await db.users.insertOne(value);

      res.send({ message: "User registered successfully" });
    } catch (err) {
      console.error("Error registering user", err);
      res.sendStatus(500);
    }
  },
  async login(req, res) {
    try {
      // Validations
      const { error, value } = login.validate(req.body);
      if (error) return res.send({ error: error.details[0].message });

      value.email = value.email.toLowerCase();

      //   Check if user exists
      const user = await db.users.findOne({ email: value.email });
      if (!user) return res.sendStatus(403);

      //   Check if password match
      const isMatch = await bcrypt.compare(value.password, user.password);
      if (!isMatch) return res.sendStatus(403);

      //   Generate auth token
      const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      res.send({ message: "User logged in successfully", authToken });
    } catch (err) {
      console.error("Error login user", err);
      res.sendStatus(500);
    }
  },
};

module.exports = service;
