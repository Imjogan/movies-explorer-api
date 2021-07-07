const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const {
  conflictEmailError,
  userNotFoundError,
  incorrectUserDataError,
  incorrectProfileDataError,
  wrongEmailPassword,
} = require('../utils/errors');

module.exports.getUser = (req, res, next) => {
  (async () => {
    try {
      const user = await User.findById(req.user._id).orFail(
        new Error('NotFound'),
      );
      res.status(200).send(user);
    } catch (err) {
      if (err.message === 'NotFound') {
        next(new NotFoundError(userNotFoundError));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(incorrectUserDataError));
      }
      next(err);
    }
  })();
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  (async () => {
    try {
      const hash = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hash,
      });
      res.status(201).send({
        name,
        email,
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(incorrectUserDataError));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(conflictEmailError));
      }
      next(err);
    }
  })();
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  (async () => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        {
          new: true,
          runValidators: true,
        },
      ).orFail(new Error('NotFound'));
      res.status(200).send(user);
    } catch (err) {
      if (err.message === 'NotFound') {
        next(new NotFoundError(userNotFoundError));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(incorrectProfileDataError));
      }
      next(err);
    }
  })();
};

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
  (async () => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AuthError(wrongEmailPassword);
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new AuthError(wrongEmailPassword);
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.status(200).send({ token });
    } catch (err) {
      next(err);
    }
  })();
};
