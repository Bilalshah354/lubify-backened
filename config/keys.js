require("dotenv/config");

exports.KEYS = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  LUBIFY_SHOPIFY_DOMAIN: process.env.LUBIFY_SHOPIFY_DOMAIN,
  LUBIFY_SHOPIFY_ACCESS_TOKEN: process.env.LUBIFY_SHOPIFY_ACCESS_TOKEN,
  MONGODB_URI: process.env.MONGO_URI || `mongodb://localhost:27017/${process.env.DB_NAME}`,
  DB_NAME: process.env.DB_NAME || "rbac-system",
  SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION || "2025-01",
};
