import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import MESSAGES from '../utils/constants.js';

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  // Skip rate limiting for authenticated requests (they include an Authorization header).
  // This prevents development-only duplicate effect invocations (React StrictMode)
  // from quickly causing 429 responses for logged-in users.
  skip: (req /*, res*/) => !!req.headers.authorization,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: MESSAGES.TOO_MANY_REQUESTS });
  },
});

export default limiter;
