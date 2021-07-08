const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const { options } = require('./utils/corsOptions');
const { limiter } = require('./utils/limiter');
const { mongoosePreset } = require('./utils/config');
const { requestedResourceNotFoundError } = require('./utils/errors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const unexpectedError = require('./middlewares/unexpectedError');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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
