const express = require('express');
const cors = require('cors');
const { connectDB, initServer } = require('./start/index');
const config = require('./config/index');

connectDB();

try {
  const app = express();
  initServer({ app });
  app.use(cors());

  const server = app
    .listen(config.port, () => {
      console.log(`Server running on port : ${config.port}`);
    })
    .on('error', (err) => {
      console.log(err);
      process.exit(1);
    });
} catch (err) {
  console.log(err);
}