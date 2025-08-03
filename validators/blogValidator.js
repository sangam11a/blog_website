const Joi = require("joi");

exports.blogSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string()).optional(),
});
