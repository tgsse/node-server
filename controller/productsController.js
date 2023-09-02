const { v4: uuid } = require('uuid')

const HttpError = require('../model/errors/HttpError')
const {HttpStatus} = require("../util/constants")

const products = [
    {
        id: uuid(),
        title: 'product 1 name',
        description: 'the best product ever!',
        price: 7.14,
    }
]

function getAll(req, res, next) {
    res.json({products})
}

function getById(req, res, next) {
    const id = req.params.id
    const product = products.find(p => p.id === id)
    if (product) {
        res.json({product})
    } else {
        next(HttpError.NotFound('product'))
    }
}

function createProduct(req, res, next) {
    const { title, description, price } = req.body
    const existingProduct = products.find(p => p.title === title)
    if (existingProduct) {
        return next(new HttpError(HttpStatus.Conflict, `Product already exists with id ${existingProduct.id}`))
    }
    const product = {
        id: uuid(),
        title,
        description,
        price,
    }
    products.push(product)

    res.status(HttpStatus.Created).json({product})
}

function editProduct(req, res, next) {
    const id = req.params.id
    const { title, price, description } = req.body
    const existingProductIndex = products.findIndex(p => p.id === id)
    if (existingProductIndex === -1) {
        return next(HttpError.NotFound(`product with id ${id}`))
    }
    const existingProduct = products[existingProductIndex]
    const updatedProduct = {
        id,
        title: title || existingProduct.title,
        description: description || existingProduct.description,
        price: price || existingProduct.description,
    }
    products[existingProductIndex] = updatedProduct
    res.json({product: updatedProduct})
}

function deleteProduct(req, res, next) {
    const id = req.params.id
    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) {
        return next(HttpError.NotFound(`product with id ${id}`))
    }

    products.splice(productIndex, 1)

    res.status(HttpStatus.NoContent).send()
}

module.exports = {
    getAll,
    getById,
    createProduct,
    editProduct,
    deleteProduct,
}