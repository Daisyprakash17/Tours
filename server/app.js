const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssPurge = require('xss-purge');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');
const errorHandler = require('./src/handlers/errorHandler');

const app = express();
app.use(
  cors({
    origin: 'https://localhost:3000',
    credentials: true,
    sameSite: 'none',
    secure: true,
  })
);

/* Global middlewares */
// Set security HTTP headers
app.use(helmet());

// Development logging
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

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against Cross-site scripting (XXS)
app.use(xssPurge());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);

// Test middleware
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// Uploaded images route
app.use('/public/img/users', express.static(__dirname + '/public/img/users/'));
app.use('/public/img/tours', express.static(__dirname + '/public/img/tours/'));

// Error handling
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
