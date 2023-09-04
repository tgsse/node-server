const express = require('express')

const applyMiddlewares = require('./middlewares/setup')
const registerRoutes = require('./routes/setup')

const app = express()

applyMiddlewares(app)
registerRoutes(app)

module.exports = app
