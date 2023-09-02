const { v4: uuid } = require('uuid')

const HttpError = require('../model/errors/HttpError')
const {HttpStatus} = require("../util/constants")
const {validationResult} = require("express-validator");

const products = [
    {
        id: uuid(),
        title: 'product 1 name',
        description: 'the best product ever!',
        price: 7.14,
    }
]

function getAll(req, res, _) {
    res.json({products})
}

function getById(req, res, next) {
    const id = req.params.id
    const product = products.find(p => p.id === id)
    if (product) {
        res.json({product})
    } else {
        next(HttpError.notFound('product'))
    }
}

function createProduct(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(new HttpError(HttpStatus.UnprocessableEntity, "Invalid data provided. Please check your inputs."))
        return
    }

    const { title, description, price } = req.body
    const existingProduct = products.find(p => p.title === title)
    if (existingProduct) {
        next(new HttpError(HttpStatus.Conflict, `Product already exists with id ${existingProduct.id}`))
        return
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(new HttpError(HttpStatus.UnprocessableEntity, "Invalid data provided. Please check your inputs."))
        return
    }

    const id = req.params.id
    const { title, price, description } = req.body
    const existingProductIndex = products.findIndex(p => p.id === id)
    if (existingProductIndex === -1) {
        next(HttpError.notFound(`product with id ${id}`))
        return
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
        next(HttpError.notFound(`product with id ${id}`))
        return
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