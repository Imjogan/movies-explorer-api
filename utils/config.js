module.exports.mongoosePreset = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

module.exports.jwtSecretKey = 'some-secret-key';
module.exports.dbAdress = 'mongodb://localhost:27017/bitfilmsdb';
