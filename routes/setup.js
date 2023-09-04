const indexRouter = require('./index')
const productsRouter = require('./api/productsRouter')
const usersRouter = require('./api/usersRouter')
const HttpError = require('../util/errors/HttpError')
const { HttpStatus } = require('../util/enums')
const fs = require('fs')
const express = require('express')
const path = require('path')

function registerRoutes(app) {
    app.use('/images', express.static(path.join('uploads', 'images')))

    app.use('/', indexRouter)
    app.use('/api/products', productsRouter)
    app.use('/api/users', usersRouter)

    app.use('/api', endpointNotFoundHandler)
    app.use(pageNotFoundHandler)

    app.use(errorHandler)
}

function pageNotFoundHandler(req, res, next) {
    next(HttpError.notFound('page requested'))
}

function endpointNotFoundHandler(req, res, next) {
    next(HttpError.notFound('specified endpoint'))
}

function errorHandler(error, req, res, next) {
    console.error(error)
    if (req.file) {
        // rollback file save if an error occurred after a file has been added
        fs.unlink(req.file.path, console.error)
    }

    // noinspection JSUnresolvedReference
    if (res.headerSent) {
        next(error)
        return
    }

    res.status(error.code || HttpStatus.InternalServerError).json({
        message: error.message || 'An unknown error occurred.',
    })
}

module.exports = registerRoutes
