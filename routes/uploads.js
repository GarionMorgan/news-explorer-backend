import express from 'express';
import { streamImage } from '../controllers/uploadsController.js';
import { imageIdParamValidator } from '../validators/uploadsValidators.js';

const router = express.Router();

// Per-request headers for image responses. This mirrors the previous
// application-level middleware that was mounted in `app.js` but keeps the
// behavior local to the uploads router so it can be composed by the routes
// index aggregator.
router.use((req, res, next) => {
  const origin = req.get('origin');
  const host = req.get('host');
  try {
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost === host) {
        // same host (including port) — restrict to same-site
        res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else {
        // different origin — allow embedding from this origin only
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    } else {
      // no origin header (direct request) — be permissive for images
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  } catch (err) {
    // fallback to permissive if parsing fails
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  next();
});

router.get('/:id', imageIdParamValidator, streamImage);

export default router;
