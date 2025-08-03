// validators/userValidator.js
const Joi = require("joi");

exports.userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});
