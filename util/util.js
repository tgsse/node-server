const logger = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");

const indexRouter = require("../routes");
const productsRouter = require("../routes/api/productsRouter");

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
    app.use('/api/products', productsRouter);

    app.use(errorHandler)
}

function errorHandler(error, req, res, next) {
    if (res.headerSent) {
        return next(error)
    }

    res
        .status(error.code || 500)
        .json({message: error.message || 'An unknown error occurred.'})
}

module.exports = {
    applyMiddlewares,
    registerRoutes,
}