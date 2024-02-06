const mongoose = require('mongoose');
const dotenv = require('dotenv');

// we have to set it up before running app, so that all variable are available there...
dotenv.config({
    path: './config.env'
});

const app = require('./app');
const {SchemaType} = require("mongoose");

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(connection => {
    // console.log(connection.connections);
    console.log('DB connection successful');
});
// console.log(app.get('env'));
// console.log(process.env);

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
    name: 'The park camper',
    price: 997
});

testTour
    .save()
    .then(document => {
        console.log(document);
    })
    .catch(error => {
        console.log('Error: ', error);
    });

const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1', () => {
    console.log(`App running on port: ${port}...`);
});