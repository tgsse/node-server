const express = require('express')

const productsController = require("../../controller/productsController")

const productsRouter = express.Router()

productsRouter.get('/', productsController.getAll)

productsRouter.get('/:id', productsController.getById)

productsRouter.post('/', productsController.createProduct)

productsRouter.patch('/:id', productsController.editProduct)

productsRouter.delete('/:id', productsController.deleteProduct)

module.exports = productsRouter