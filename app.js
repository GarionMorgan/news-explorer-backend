import express from "express";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import articlesRoutes from "./routes/articles.js";
import uploadsRoutes from "./routes/uploads.js";
import { requestLogger, errorLogger } from "./utils/logger.js";
import { errors as celebrateErrors } from "celebrate";
import parseMongoError from "./utils/parseMongoError.js";
import mongoose from "mongoose";
import config from "./config/index.js";

const app = express();

// configure Helmet to allow cross-origin resource loading where needed.
// Set Cross-Origin-Resource-Policy to `cross-origin` and disable
// Cross-Origin-Embedder-Policy to avoid requiring COEP on the document.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json());

// mount uploads streaming route (GridFS-backed) with per-request CORP/CORS
app.use(
  "/uploads",
  (req, res, next) => {
    const origin = req.get("origin");
    const host = req.get("host");
    try {
      if (origin) {
        const originHost = new URL(origin).host;
        if (originHost === host) {
          // same host (including port) — restrict to same-site
          res.setHeader("Cross-Origin-Resource-Policy", "same-site");
          res.setHeader("Access-Control-Allow-Origin", origin);
        } else {
          // different origin — allow embedding from this origin only
          res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
          res.setHeader("Access-Control-Allow-Origin", origin);
        }
      } else {
        // no origin header (direct request) — be permissive for images
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    } catch (err) {
      // fallback to permissive if parsing fails
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    next();
  },
  uploadsRoutes
);

// request logging (JSON)
app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/articles", articlesRoutes);

// error logging (JSON)
app.use(errorLogger);

// connect to MongoDB (app handles DB connection)
try {
  // top-level await is supported in ESM; use promise chain here to keep stack traces simple
  await mongoose.connect(config.MONGO_URI);
  // eslint-disable-next-line no-console
  console.log("Connected to MongoDB");
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
}

// celebrate validation errors -> let centralized handler handle them
app.use(celebrateErrors());

// centralized error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  // Joi / celebrate validation error
  if (err && err.joi) {
    return res
      .status(400)
      .json({ error: err.joi.message || "Validation error" });
  }

  // Duplicate key or mongoose validation
  const parsed = parseMongoError(err);
  if (parsed) return res.status(parsed.status).json({ error: parsed.message });

  // JWT errors
  if (
    err &&
    (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
  ) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Mongoose bad ObjectId (CastError)
  if (err && err.name === "CastError") {
    return res.status(400).json({ error: "Invalid identifier" });
  }

  // fallback
  return res.status(500).json({ error: "Internal Server Error" });
});

// start HTTP server after DB connection
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});

export default app;
