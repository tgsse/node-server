const { v4: uuid } = require('uuid')
const {validationResult} = require("express-validator");

const HttpError = require('../util/errors/HttpError')
const {HttpStatus} = require("../util/constants")
const Product = require('../models/product')

async function getAll(req, res, next) {
    let products
    try {
        products = await Product.find()
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }
    res.json({products: products.map(p => p.toObject({getters: true})) })
}

async function getById(req, res, next) {
    const id = req.params.id

    let product
    try {
        product = await Product.findById(id)
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }

    if (product) {
        res.json({product: product.toObject({getters: true})})
    } else {
        next(HttpError.notFound('product'))
    }
}

async function createProduct(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(new HttpError(HttpStatus.UnprocessableEntity, "Invalid data provided. Please check your inputs."))
        return
    }

    const {title, description, price} = req.body

    const product = new Product({
        title,
        description,
        price,
    })

    try {
        await product.save()
    } catch (e) {
        next(e)
        return
    }

    res.status(HttpStatus.Created).json({product})
}

async function editProduct(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(new HttpError(HttpStatus.UnprocessableEntity, "Invalid data provided. Please check your inputs."))
        return
    }

    const id = req.params.id
    const {title, price, description} = req.body

    let product
    try {
        product = await Product.findById(id)
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }

    if (title && title !== product.title) {
        product.title = title
    }
    if (price && price !== product.price) {
        product.price = price
    }
    if (description && description !== product.description) {
        product.description = description
    }

    try {
        await product.save()
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }

    res.json({product: product.toObject({getters: true})})
}

async function deleteProduct(req, res, next) {
    const id = req.params.id

    let product
    try {
        product = await Product.findById(id)
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }

    try {
        await product.deleteOne()
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }

    res.status(HttpStatus.NoContent).send()
}

module.exports = {
    getAll,
    getById,
    createProduct,
    editProduct,
    deleteProduct,
}