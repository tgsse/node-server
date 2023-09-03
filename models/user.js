const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    // https://mongoosejs.com/docs/guide.html

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    isLoggedIn: {
        type: Boolean,
        required: false,
        default: false,
    },
})

userSchema.plugin(uniqueValidator)

exports.User = mongoose.model('User', userSchema)
