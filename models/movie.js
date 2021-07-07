const mongoose = require('mongoose');
const validator = require('validator');

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
        message: 'Вы должны указать ссылку',
      },
      required: true,
    },
    trailer: {
      type: String,
      validate: {
        validator(string) {
          return validator.isURL(string);
        },
        message: 'Вы должны указать ссылку',
      },
      required: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator(string) {
          return validator.isURL(string);
        },
        message: 'Вы должны указать ссылку',
      },
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      validate: {
        validator(string) {
          // eslint-disable-next-line no-useless-escape
          return validator.isAlphanumeric(string, ['ru-RU'], { ignore: '/[\s-]/' });
        },
        message: 'Вы должны указать название на русском языке',
      },
    },
    nameEN: {
      type: String,
      required: true,
      validate: {
        validator(string) {
          // eslint-disable-next-line no-useless-escape
          return validator.isAlphanumeric(string, ['en-IN'], { ignore: '/[s-]/' });
        },
        message: 'Вы должны указать название на английском языке',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
