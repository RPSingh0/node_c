const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const path = require("path");

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set security HTTP headers
app.use(helmet());

// 1. MIDDLEWARES
// MIDDLEWARE for serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiter from sam api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

// data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// PUG routes
app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The forest hiker',
        user: 'Jonas'
    });
});

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All tours'
    })
});

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    })
});

// MOUNTING THE ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// if not handled by any of the router
app.all('*', (req, res, next) => {
    // res.status(404)
    //     .json({
    //         status: 'fail',
    //         message: `Can't find ${req.originalUrl} on this server!`
    //     })
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;