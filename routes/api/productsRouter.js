const express = require('express')

const HttpError = require("../../model/errors/HttpError");
const productsController = require("../../controller/productsController");

const productsRouter = express.Router()

productsRouter.get('/', productsController.getAll)

productsRouter.get('/:productId', productsController.getById)

productsRouter.post('/', productsController.addProduct)

productsRouter.put('/', productsController.editProduct)

module.exports = productsRouter