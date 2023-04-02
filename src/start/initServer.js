const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const config = require('../config/index');


const {
  storyRouter
} = require('../api/routes');


const initServer = ({ app }) => {
  app.use(helmet());
  app.enable('trust proxy');

  if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
  } else {
    app.use(cors());
  }

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.use(express.json());
  app.get('/', (req, res) => res.send('Server up!'));
  app.use(`${config.api.prefix}/story`, storyRouter);
};

module.exports = initServer;