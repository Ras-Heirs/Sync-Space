const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name: Joi.string().required().max(255),
    email: Joi.string().email().required().max(255),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  updateProfile: Joi.object({
    name: Joi.string().max(255),
    domisili: Joi.string().max(100),
    hobbies: Joi.array().items(Joi.string()),
    image: Joi.string().uri().allow(''),
  }),
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMessage,
        payload: null
      });
    }
    
    next();
  };
};

module.exports = {
  validate,
  schemas
};
