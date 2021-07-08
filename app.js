const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const { mongoosePreset } = require('./utils/constants');
const { requestedResourceNotFoundError } = require('./utils/errors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const unexpectedError = require('./middlewares/unexpectedError');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// ограничиваем количество запросов к API в час
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// настройки CORS
const options = {
  origin: [
    'http://localhost:3000',
    'http://130.193.52.168',
    'https://130.193.52.168',
    'http://movies-explorer.mjogan.nomoredomains.club',
    'https://movies-explorer.mjogan.nomoredomains.club',
    'http://b.movies-explorer.mjogan.nomoredomains.club',
    'https://b.movies-explorer.mjogan.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

// порт из файла окружения
const { PORT = 3000 } = process.env;
const app = express();

// подключаем заголовки безопасности
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', mongoosePreset);

// подключаем логгер запросов
app.use(requestLogger);

// подключаем мидлвару CORS
app.use('*', cors(options));

// подключаем мидлвару ограничителя запросов
app.use(limiter);

// роут логина
app.post(
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
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      password: Joi.string().required().min(8),
      email: Joi.string().required().email(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

// мидлвара авторизации
app.use(auth);

// общий файл роутов
app.use('/', require('./routes/index'));

// подключаем логгер ошибок
app.use(errorLogger);

// обрабатываем несуществующий роут
app.use((req, res, next) => {
  next(new NotFoundError(requestedResourceNotFoundError));
});

// обрабатываем ошибки celebrate
app.use(errors());

// обработка непредвиденной ошибки
app.use(unexpectedError);

app.listen(PORT);
