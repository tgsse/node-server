const express = require('express')
const { check, oneOf } = require('express-validator')

const productsController = require('../../controller/productsController')
const fileUpload = require('../../middlewares/fileUpload')

const productsRouter = express.Router()

productsRouter.get('/', productsController.getAll)

productsRouter.get('/:id', productsController.getById)

productsRouter.get('/user/:id', productsController.getProductsByUserId)

productsRouter.post(
    '/',
    fileUpload.single('image'),
    check(['title', 'description', 'price']).not().isEmpty(),
    productsController.createProduct
)

productsRouter.patch(
    '/:id',
    oneOf([
        check('title').not().isEmpty(),
        check('description').not().isEmpty(),
        check('price').not().isEmpty(),
    ]),
    productsController.editProduct
)

productsRouter.delete('/:id', productsController.deleteProduct)

module.exports = productsRouter
