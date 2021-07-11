const mongoose = require('mongoose');
const validator = require('validator');
const { minLength, maxLength } = require('../utils/constants');
const { wrongMailFormat } = require('../utils/errors');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
        message: wrongMailFormat,
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
