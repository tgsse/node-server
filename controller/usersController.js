const HttpError = require('../util/errors/HttpError')
const { MIN_PASSWORD_LENGTH, SALT } = require('../util/constants')
const { HttpStatus } = require('../util/enums')
const { validationResult } = require('express-validator')
const { User } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './secrets/.env' })

async function getAll(req, res, next) {
    let users
    try {
        users = await User.find({}, '-password')
    } catch (e) {
        next(HttpError.serverError())
        return
    }
    res.json({ users: users.map(u => u.toObject()) })
}

async function getById(req, res, next) {
    const id = req.params.id

    let user
    try {
        user = await User.findById(id, '-password')
        if (!user) {
            throw HttpError.notFound(`user with id ${id}`)
        }
    } catch (e) {
        next(e)
        return
    }

    res.json({ user: user.toObject() })
}

async function createUser(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(
            new HttpError(
                HttpStatus.UnprocessableEntity,
                'Invalid data provided. Please check your inputs.',
            ),
        )
        return
    }

    const { name, email, password } = req.body
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, SALT)
    } catch (e) {
        next(e)
        return
    }

    const user = new User({
        name,
        email,
        password: hashedPassword,
        createdProducts: [],
    })

    try {
        await user.save()
    } catch (e) {
        next(e)
        return
    }

    res.status(HttpStatus.Created).json({ name, email })
}

async function editUser(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        next(
            new HttpError(
                HttpStatus.UnprocessableEntity,
                'Invalid data provided. Please check your inputs.',
            ),
        )
        return
    }

    const id = req.params.id
    const { name, password } = req.body

    let user
    try {
        user = await User.findById(id)
        if (!user) {
            throw HttpError.notFound(`user with id ${id}`)
        }
    } catch (e) {
        next(e)
        return
    }

    if (name && name.length > 0) {
        user.name = name
    }
    if (password && password.length > MIN_PASSWORD_LENGTH) {
        user.password = password
    }

    try {
        await user.save()
    } catch (e) {
        next(e)
        return
    }

    res.json({ message: "Changes have been applied successfully." })
}

async function deleteUser(req, res, next) {
    const id = req.params.id

    let user
    try {
        user = await User.findById(id)
        if (!user) {
            throw HttpError.notFound(`user with id ${id}`)
        }
    } catch (e) {
        next(e)
        return
    }

    try {
        await user.deleteOne()
    } catch (e) {
        next(e)
        return
    }

    res.status(HttpStatus.NoContent).send()
}

async function login(req, res, next) {
    // NOTE: jwt tokens cannot be invalidated
    const { email, password } = req.body

    let user
    let token
    try {
        user = await User.findOne({ email })
        if (!user) {
            throw new HttpError(
                HttpStatus.Unauthorized,
                `Could not identify user. Credentials seem to be wrong`,
            )
        }

        let isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            throw new HttpError(
                HttpStatus.Unauthorized,
                `Could not identify user. Credentials seem to be wrong`,
            )
        }

        token = await jwt.sign(
            { userId: user.id, email: user.email },
            process.env.AUTH_TOKEN_PRIVATE_KEY,
            { expiresIn: '2h' },
        )
    } catch (e) {
        next(e)
        return
    }

    try {
        await user.save()
    } catch (e) {
        next(e)
        return
    }

    res.json({ token })
}

async function logout(req, res, next) {
    const { email } = req.body

    let user
    try {
        user = await User.findOne({ email })
        if (!user) {
            throw new HttpError(
                HttpStatus.Unauthorized,
                `Could not identify user. Credentials seem to be wrong`,
            )
        }
    } catch (e) {
        next(e)
        return
    }

    // try {
    //
    // } catch (e) {
    //     next(e)
    //     return
    // }

    user.isLoggedIn = false

    try {
        await user.save()
    } catch (e) {
        next(e)
        return
    }

    res.status(HttpStatus.NoContent).send()
}

module.exports = {
    getAll,
    getById,
    createUser,
    editUser,
    deleteUser,
    login,
    logout,
}
