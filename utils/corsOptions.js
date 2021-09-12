// настройки CORS
module.exports.options = {
  origin: [
    'http://localhost:3000',
    'http://130.193.52.168',
    'https://130.193.52.168',
    'http://movies-explorer.mj.nomoredomains.rocks',
    'https://movies-explorer.mj.nomoredomains.rocks',
    'http://api.movies-explorer.mj.nomoredomains.rocks',
    'https://api.movies-explorer.mj.nomoredomains.rocks',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};
