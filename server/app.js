const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');
const errorHandler = require('./src/handlers/errorHandler');

const app = express();

// global middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit repeated requests to public APIs
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

app.use(express.json());

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Error handling
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
