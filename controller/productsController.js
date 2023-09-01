const { v4: uuid } = require('uuid');

const HttpError = require('../model/errors/HttpError');

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
    const product = products.find(p => p.id === req.params.id)
    if (product) {
        res.json({product})
    } else {
        next(HttpError.NotFound('product'))
    }
}

function addProduct(req, res, next) {
    const { title, description, price } = req.body
    const existingProduct = products.find(p => p.title === title)
    if (existingProduct) {
        return next(new HttpError(409, `Product already exists with id ${existingProduct.id}`))
    }
    const product = {
        id: uuid(),
        title,
        description,
        price,
    }
    products.push(product)

    res.status(201).json({product})
}

function editProduct(req, res, next) {
    const { id, title, price, description } = req.body
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

module.exports = {
    getAll,
    getById,
    addProduct,
    editProduct,
}