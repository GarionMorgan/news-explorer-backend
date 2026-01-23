import dotenv from 'dotenv';

// Load .env in non-production environments
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV !== 'production') {
  dotenv.config();
}

const devConfig = {
  MONGO_URI:
    process.env.DEV_MONGO_URI ||
    process.env.MONGODB_URI ||
    'mongodb://localhost:27017/news-explorer',
  JWT_SECRET:
    process.env.DEV_JWT_SECRET || process.env.JWT_SECRET || 'secret-key',
  RATE_LIMIT_WINDOW_MS:
    parseInt(process.env.DEV_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.DEV_RATE_LIMIT_MAX, 10) || 100,
};

const prodConfig = {
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  RATE_LIMIT_WINDOW_MS:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
};

const config = NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
