var express = require('express');
var config = require('./config');
var mailer = require('nodemailer');
var mysql = require('mysql');
var path = require('path');
var util = require('util');

var app = express();
var sql = require('mysql').createPool(config.mysql);
var mail = mailer.createTransport(config.smtp);
var prod = process.env.NODE_ENV === 'production';

app.use(require('body-parser').urlencoded({ extended: true }));

// Only enable static file serving in development. In production,
// they should be served by nginx with try_files.
if (!prod) {
    app.use(express.static(path.join(__dirname, '/dist')));
    app.get('/', function (req, res) {
        res.sendfile(path.join(__dirname, '/dist/index.html'));
    });
}

app.listen(config.server.port, config.server.host);
