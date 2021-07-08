// настройки CORS
module.exports.options = {
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
