import parseMongoError from '../utils/parseMongoError.js';

/* eslint-disable no-unused-vars */
export default function errorHandler(err, req, res, next) {
  if (err && err.joi) {
    return res
      .status(400)
      .json({ error: err.joi.message || 'Validation error' });
  }

  if (err && err.message === 'Validation failed') {
    return res.status(400).json({ error: 'Validation failed' });
  }

  if (err && typeof err.status === 'number') {
    const { status } = err;
    const message = err.message || (status === 500 ? 'Internal Server Error' : 'Error');
    return res.status(status).json({ error: message });
  }

  const parsed = parseMongoError(err);
  if (parsed) return res.status(parsed.status).json({ error: parsed.message });

  if (
    err
    && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
  ) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (err && err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid identifier' });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
}
/* eslint-enable no-unused-vars */
