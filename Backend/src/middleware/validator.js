const Joi = require('joi');

const schemas = {
  // Room Validation
  createRoom: Joi.object({
    categoryId: Joi.string().uuid().required(),
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).allow('', null),
    region: Joi.string().min(2).max(100).required(),
    maxCapacity: Joi.number().integer().min(2).max(100).required(),
    isPrivate: Joi.boolean().default(false),
    activityDetails: Joi.object().default({}),
  }),

  // User Profile Validation
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(255),
    domicile: Joi.string().max(100),
    hobbies: Joi.array().items(Joi.string()),
    image: Joi.string().uri().allow('', null),
  }),

  // Auth Validation
  register: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: errorMessage,
      });
    }
    next();
  };
};

module.exports = {
  schemas,
  validate,
};
