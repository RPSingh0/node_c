const dotenv = require('dotenv');

// we have to set it up before running app, so that all variable are available there...
dotenv.config({
    path: './config.env'
});

const app = require('./app');
// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1', () => {
    console.log(`App running on port: ${port}...`);
});