const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('Unhandled Exception! ❌  Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
})


// we have to set it up before running app, so that all variable are available there...
dotenv.config({
    path: './config.env'
});

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(connection => {
    console.log('Connected to MongoDB Atlas!...');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, '127.0.0.1', () => {
    console.log(`App running on port: ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! ❌  Shutting down...');
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
});

// process.on('uncaughtException', err => {
//     console.log('Unhandled Exception! ❌  Shutting down...');
//     console.log(err.name, err.message);
//     server.close(() => {
//         process.exit(1);
//     })
// })

// console.log(x);