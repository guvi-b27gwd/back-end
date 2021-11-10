const Joi = require("joi");

const guvi = (value, helpers) => {
  if (value.length < 5) {
    return helpers.message("Guvi validation failed");
  }

  return value;
};

const schema = {
  register: Joi.object({
    name: Joi.string().min(3).max(50).alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
  }),
  post: Joi.object({
    title: Joi.string().max(100).required().custom(guvi),
    body: Joi.string().min(15).max(250).required(),
  }),
};

module.exports = schema;
