require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  port: process.env.PORT || 5000,
  databaseURL: process.env.MONGODB_URI,
  dbPassword: process.env.DB_PASSWORD,
  api: {
    prefix: '/api/v1',
  },
  tokenSecret: process.env.TOKEN_SECRET,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  clientURL: process.env.CLIENT_URL,
  serverURL: process.env.SERVER_URL,
  openAPIKey: process.env.OPEN_API_KEY
};

module.exports = config;