const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
app.listen(port, '127.0.0.1', () => {
    console.log(`App running on port: ${port}...`);
});