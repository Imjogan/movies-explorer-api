const mongoose = require('mongoose');
const validator = require('validator');
const { wrongLink, wrongNameInEnglish, wrongNameInRussian } = require('../utils/errors');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      validate: {
        validator(string) {
          return validator.isURL(string);
        },
        message: wrongLink,
      },
      required: true,
    },
    trailer: {
      type: String,
      validate: {
        validator(string) {
          return validator.isURL(string);
        },
        message: wrongLink,
      },
      required: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator(string) {
          return validator.isURL(string);
        },
        message: wrongLink,
      },
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      validate: {
        validator(string) {
          return validator.isAlphanumeric(string, ['ru-RU'], { ignore: '/[ -"«»]/' });
        },
        message: wrongNameInRussian,
      },
    },
    nameEN: {
      type: String,
      required: true,
      validate: {
        validator(string) {
          return validator.isAlphanumeric(string, ['en-IN'], { ignore: '/[ -"«»]/' });
        },
        message: wrongNameInEnglish,
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
