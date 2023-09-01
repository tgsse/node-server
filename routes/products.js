const express = require('express')

const productsRouter = express.Router()

const products = [
    {
        title: "product 1 name",
        description: "the best product ever!",
        pricePerItem: 7.14,
    }
]

productsRouter.get('/', (req, res, next) => {
    res.json({products})
})

module.exports = productsRouter