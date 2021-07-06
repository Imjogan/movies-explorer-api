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
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string()
          .required()
          .custom((value, helper) => {
            if (!validator.isURL(value, { require_protocol: true })) {
              return helper.message('Вы должны указать ссылку');
            }
            return value;
          }),
      })
      .unknown(true),
  }),
  createMovie,
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
