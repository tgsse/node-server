const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    // https://mongoosejs.com/docs/guide.html

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Product', productSchema)