const express = require('express');
const morgan = require('morgan');

const app = express();

// middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

module.exports = app;
