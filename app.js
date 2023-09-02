const express = require('express')

const {
    applyMiddlewares,
    registerRoutes,
} = require("./util/util")

const app = express()

applyMiddlewares(app)
registerRoutes(app)

module.exports = app
