const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { options } = require('./utils/corsOptions');
const { limiter } = require('./utils/limiter');
const { mongoosePreset, dbAdress } = require('./utils/config');
const unexpectedError = require('./middlewares/unexpectedError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// порт из файла окружения
const { PORT = 3000, DATABASE, NODE_ENV } = process.env;
const app = express();

// подключаем заголовки безопасности
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATABASE : dbAdress, mongoosePreset);

// подключаем логгер запросов
app.use(requestLogger);

// подключаем мидлвару CORS
app.use('*', cors(options));

// подключаем мидлвару ограничителя запросов
app.use(limiter);

// общий файл роутов
app.use('/', require('./routes/index'));

// подключаем логгер ошибок
app.use(errorLogger);

// обрабатываем ошибки celebrate
app.use(errors());

// обработка непредвиденной ошибки
app.use(unexpectedError);

app.listen(PORT);
