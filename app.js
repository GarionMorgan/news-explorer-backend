import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errors as celebrateErrors } from 'celebrate';
import mongoose from 'mongoose';
import { requestLogger, errorLogger } from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import rateLimiter from './middlewares/rateLimiter.js';
import config from './config/index.js';
import routes from './routes/index.js';

const app = express();

// configure Helmet to allow cross-origin resource loading where needed.
// Set Cross-Origin-Resource-Policy to `cross-origin` and disable
// Cross-Origin-Embedder-Policy to avoid requiring COEP on the document.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors());
app.use(express.json());

// uploads route middleware moved into `routes/uploads.js`

// request logging (JSON)
app.use(requestLogger);

// rate limiter (global)
app.use(rateLimiter);

// single main routes aggregator
app.use('/', routes);

// error logging (JSON)
app.use(errorLogger);

// connect to MongoDB (app handles DB connection)
try {
  // top-level await is supported in ESM; use promise chain here to keep stack traces simple
  await mongoose.connect(config.MONGO_URI);
  // connected to MongoDB
} catch (err) {
  // failed to connect to MongoDB
  process.exit(1);
}

// celebrate validation errors -> let centralized handler handle them
app.use(celebrateErrors());

// centralized error handler (extracted to middleware)
app.use(errorHandler);

// start HTTP server after DB connection
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  // server listening on port
});

export default app;
