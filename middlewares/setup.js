const logger = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')

function applyMiddlewares(app) {
    app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, 'public')))
    app.use(bodyParser.json())
}

module.exports = applyMiddlewares
