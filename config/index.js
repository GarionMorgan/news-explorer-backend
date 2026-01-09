import dotenv from "dotenv";

// Load .env in non-production environments
const NODE_ENV = process.env.NODE_ENV || "development";
if (NODE_ENV !== "production") {
  dotenv.config();
}

const devConfig = {
  MONGO_URI:
    process.env.DEV_MONGO_URI || "mongodb://localhost:27017/news-explorer",
};

const prodConfig = {
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI,
};

const config = NODE_ENV === "production" ? prodConfig : devConfig;

export default config;
