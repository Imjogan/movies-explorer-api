const rateLimit = require('express-rate-limit');
// ограничиваем количество запросов к API в час
module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
