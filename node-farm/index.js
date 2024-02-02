const fs = require("fs");
const http = require('http');
const url = require('url');
const path = require("path");

// File ----------------------
// Blocking, synchronous way
/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log("File written!");
 */

// Non-blocking, asynchronous way
/*
fs.readFile('./txt/start.txt', 'utf-8', (error, data) => {
    console.log(data);
});
console.log('will read file');
 */
/*
fs.readFile('./txt/start.txt', 'utf-8', (error, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`, 'utf-8', (error, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', error => {
                console.log('Your file has been written 👌')
            })
        });
    });
});
console.log('will read file');
 */

// Server ----------------------
const server = http.createServer((request, response) => {

    const pathName = request.url;

    if (pathName === '/' || pathName === '/overview') {
        response.end('Hello from the server!');
    } else if (pathName === '/product') {
        response.end('This is the product');
    } else {
        response.writeHead(404, {
            'Content-type': 'text/html'
        });
        response.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
})