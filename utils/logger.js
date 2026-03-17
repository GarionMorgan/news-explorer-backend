// utils/logger.js
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import expressWinston from 'express-winston';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const jsonFormat = winston.format.json();

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'request.log'),
      level: 'info',
    }),
  ],
  format: jsonFormat,
  meta: true,
  msg: '{{req.method}} {{req.originalUrl}} {{res.statusCode}} {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false,
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
  ],
  format: jsonFormat,
});

export { requestLogger, errorLogger };
