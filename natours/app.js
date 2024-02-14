const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());

// MIDDLEWARE for serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// MOUNTING THE ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// if not handled by any of the router
app.all('*', (req, res, next) => {
    res.status(404)
        .json({
            status: 'fail',
            message: `Can't find ${req.originalUrl} on this server!`
        })
});

module.exports = app;