const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  incorrectMovieDataError,
  movieNotFoundError,
  insufficientRights,
} = require('../utils/errors');

module.exports.getMovies = (req, res, next) => {
  (async () => {
    try {
      const movies = await Movie.find({}).populate('owner');
      res.status(200).send(movies);
    } catch (err) {
      next(err);
    }
  })();
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  (async () => {
    try {
      const movie = await Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: req.user._id,
      });
      res.status(201).send(movie);
    } catch (err) {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(incorrectMovieDataError));
      }
      next(err);
    }
  })();
};

module.exports.deleteMovie = (req, res, next) => {
  (async () => {
    try {
      const movie = await Movie.findById(req.params.movieId).orFail(
        new Error('NotFound'),
      );
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(insufficientRights);
      }
      const userMovie = await Movie.findByIdAndRemove(req.params.movieId);
      res.status(200).send(userMovie);
    } catch (err) {
      if (err.message === 'NotFound') {
        next(new NotFoundError(movieNotFoundError));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(incorrectMovieDataError));
      }
      next(err);
    }
  })();
};
