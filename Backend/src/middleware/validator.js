const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name: Joi.string().required().max(255).messages({
      'string.empty': 'Nama tidak boleh kosong',
      'string.max': 'Nama maksimal 255 karakter',
      'any.required': 'Nama wajib diisi'
    }),
    email: Joi.string().email().required().max(255).messages({
      'string.empty': 'Email tidak boleh kosong',
      'string.email': 'Format email tidak valid',
      'any.required': 'Email wajib diisi'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password tidak boleh kosong',
      'string.min': 'Password minimal harus 6 karakter',
      'any.required': 'Password wajib diisi'
    }),
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email tidak boleh kosong',
      'string.email': 'Format email tidak valid',
      'any.required': 'Email wajib diisi'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password tidak boleh kosong',
      'any.required': 'Password wajib diisi'
    }),
  }),
  updateProfile: Joi.object({
    name: Joi.string().max(255).messages({
      'string.max': 'Nama maksimal 255 karakter'
    }),
    domicile: Joi.string().max(100).required().messages({
      'string.empty': 'Domisili tidak boleh kosong',
      'any.required': 'Domisili wajib diisi'
    }),
    hobbies: Joi.array().items(Joi.string()).messages({
      'array.base': 'Hobi harus berupa array'
    }),
    image: Joi.string().uri().allow('', null).messages({
      'string.uri': 'URL gambar tidak valid'
    }),
  }),
  createRoom: Joi.object({
    categoryId: Joi.string().uuid(),
    categoryName: Joi.string().max(100),
    title: Joi.string().required().max(255).messages({
      'string.empty': 'Judul ruangan tidak boleh kosong',
      'any.required': 'Judul ruangan wajib diisi'
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Deskripsi tidak boleh kosong',
      'any.required': 'Deskripsi wajib diisi'
    }),
    region: Joi.string().required().max(100).messages({
      'string.empty': 'Wilayah tidak boleh kosong',
      'any.required': 'Wilayah wajib diisi'
    }),
    maxCapacity: Joi.number().integer().min(2).required().messages({
      'number.base': 'Kuota harus berupa angka',
      'number.min': 'Kuota minimal 2 orang',
      'any.required': 'Kuota wajib diisi'
    }),
    isPrivate: Joi.boolean(),
    activityDetails: Joi.object(),
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
