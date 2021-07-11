const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { updateUser, getUser } = require('../controllers/users');
const { wrongEmail } = require('../utils/errors');

router.get('/me', getUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!validator.isEmail(value, { require_protocol: true })) {
            return helper.message(wrongEmail);
          }
          return value;
        }),
    }),
  }),
  updateUser,
);

module.exports = router;
