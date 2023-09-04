const { validationResult } = require('express-validator')

const HttpError = require('../util/errors/HttpError')
const { HttpStatus } = require('../util/enums')
const { Product } = require('../models/product')
const { User } = require('../models/user')
const { startSession } = require('mongoose')

async function getAll(req, res, next) {
    let products
    try {
        products = await Product.find()
    } catch (e) {
        console.error(e)
        next(HttpError.serverError())
        return
    }
    res.json({ products: products.map(p => p.toObject()) })
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
        res.json({ product: product.toObject() })
    } else {
        next(HttpError.notFound('product'))
    }
}

async function getProductsByUserId(req, res, next) {
    const id = req.params.id

    let userWithProducts
    try {
        userWithProducts = await User.findById(id).populate('createdProducts')
        if (!userWithProducts) {
            throw HttpError.notFound(`user with id ${id}`)
        }
    } catch (e) {
        next(e)
        return
    }

    res.json({
        products: userWithProducts.createdProducts.map(p => p.toObject()),
    })
}

async function createProduct(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(
            new HttpError(
                HttpStatus.UnprocessableEntity,
                'Invalid data provided. Please check your inputs.'
            )
        )
        return
    }

    const { title, description, price, userId } = req.body

    let user
    try {
        user = await User.findById(userId)
        if (!user) {
            throw HttpError.notFound(`user with id ${userId}`)
        }
    } catch (e) {
        next(e)
        return
    }

    const product = new Product({
        title,
        description,
        price,
        createdBy: userId,
    })

    try {
        const session = await startSession()
        session.startTransaction()
        await product.save({ session })
        user.createdProducts.push(product)
        await user.save({ session })
        await session.commitTransaction()
    } catch (e) {
        next(e)
        return
    }

    res.status(HttpStatus.Created).json({ product })
}

async function editProduct(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(
            new HttpError(
                HttpStatus.UnprocessableEntity,
                'Invalid data provided. Please check your inputs.'
            )
        )
        return
    }

    const id = req.params.id
    const { title, price, description } = req.body

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

    res.json({ product: product.toObject() })
}

async function deleteProduct(req, res, next) {
    const id = req.params.id

    let product
    try {
        product = await Product.findById(id).populate('createdBy')
        if (!product) {
            throw new HttpError(
                HttpStatus.UnprocessableEntity,
                `Invalid data provided. Product does not exist with id ${id}.`
            )
        }
    } catch (e) {
        next(HttpError.serverError())
        return
    }

    try {
        const session = await startSession()
        session.startTransaction()

        await product.deleteOne({ session })
        product.createdBy.createdProducts.pull(product)
        await product.createdBy.save({ session })

        await session.commitTransaction()
    } catch (e) {
        next(e)
        return
    }

    res.status(HttpStatus.NoContent).send()
}

module.exports = {
    getAll,
    getById,
    getProductsByUserId,
    createProduct,
    editProduct,
    deleteProduct,
}
