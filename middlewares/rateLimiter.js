import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import MESSAGES from '../utils/constants.js';

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: MESSAGES.TOO_MANY_REQUESTS });
  },
});

export default limiter;
