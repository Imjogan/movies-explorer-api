const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { mongoosePreset } = require('./utils/constants');

// порт из файла окружения
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', mongoosePreset);

app.listen(PORT);
