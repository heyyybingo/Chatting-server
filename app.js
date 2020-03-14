const express = require('express')
const app = express()
const http = require('http')
const io = require('./Chat/io.js')
app.get('/', function (req, res) {
    res.send('Hello World')
})
app.use("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
});
const server = app.listen(3000, function () {
    console.log('server listening on port 3000')
})
io(server)