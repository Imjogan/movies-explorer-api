const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string(),
      movieId: Joi.string(),
      nameRU: Joi.string(),
      nameEN: Joi.string(),
      image: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            return helper.message('Вы должны указать ссылку');
          }
          return value;
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            return helper.message('Вы должны указать ссылку');
          }
          return value;
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            return helper.message('Вы должны указать ссылку');
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
