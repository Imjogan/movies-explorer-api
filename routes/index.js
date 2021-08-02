const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { requestedResourceNotFoundError } = require('../utils/errors');
const NotFoundError = require('../errors/not-found-err');

// роут логина
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required().min(8),
      email: Joi.string().required().email(),
    }),
  }),
  login,
);

// роут регистрации
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required().min(8),
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);

// мидлвара авторизации
router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));
// обрабатываем несуществующий роут
router.use((req, res, next) => {
  next(new NotFoundError(requestedResourceNotFoundError));
});

module.exports = router;
