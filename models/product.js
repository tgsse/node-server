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
    },
    createdBy: {
        type: mongoose.default.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    image: {
        type: String,
        required: false,
    },
})

exports.Product = mongoose.model('Product', productSchema)
