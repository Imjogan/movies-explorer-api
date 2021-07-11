const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { wrongLink } = require('../utils/errors');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            return helper.message(wrongLink);
          }
          return value;
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            return helper.message(wrongLink);
          }
          return value;
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            return helper.message(wrongLink);
          }
          return value;
        }),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
