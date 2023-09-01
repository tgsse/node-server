const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");

const indexRouter = require("../routes");
const productsRouter = require("../routes/products");

function applyMiddlewares(app) {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.json())
}

function registerRoutes(app) {
    app.use('/', indexRouter);
    app.use('/products', productsRouter);
}

module.exports = {
    applyMiddlewares,
    registerRoutes,
}