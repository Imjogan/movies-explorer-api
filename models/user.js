const mongoose = require('mongoose');
const validator = require('validator');
const { minLength, maxLength } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: minLength,
      maxlength: maxLength,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(string) {
          return validator.isEmail(string);
        },
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
