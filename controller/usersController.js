const { v4: uuid } = require('uuid')
const HttpError = require('../model/errors/HttpError')
const {HttpStatus} = require("../util/constants");
const {validationResult} = require("express-validator");

const users = [
    {
        id: uuid(),
        name: 'Johny Blaze',
        email: 'ghostrider@hotmail.com',
        password: 'Whip1',
        isLoggedIn: false,
    }
]

function getAll(req, res, _) {
    res.json({users})
}

function getById(req, res, next) {
    const id = req.params.id
    const user = users.find(u => u.id === id)
    if (user) {
        res.json({user})
    } else {
        next(HttpError.NotFound('user'))
    }
}

function createUser(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError(HttpStatus.UnprocessableEntity, "Invalid data provided. Please check your inputs."))
    }

    const { name, email, password } = req.body
    const existingUser = users.find(p => p.email === email)
    if (existingUser) {
        return next(new HttpError(HttpStatus.Conflict, `User already exists with id ${existingUser.id}.`))
    }
    const user = {
        id: uuid(),
        name,
        email,
        password,
        isLoggedIn: false,
    }
    users.push(user)

    res.status(HttpStatus.Created).json({user})
}

function editUser(req, res, next) {
    const id = req.params.id
    const { name, password } = req.body
    const existingUserIndex = users.findIndex(p => p.id === id)
    if (existingUserIndex === -1) {
        return next(HttpError.NotFound(`user with id ${id}`))
    }
    const existingUser = users[existingUserIndex]
    const updatedUser = {
        ...existingUser,
        name: name || existingUser.name,
        password: password || existingUser.password,
    }
    users[existingUserIndex] = updatedUser
    res.json({user: updatedUser})
}

function deleteUser(req, res, next) {
    const id = req.params.id
    const userIndex = users.findIndex(p => p.id === id)
    if (userIndex === -1) {
        return next(HttpError.NotFound(`user with id ${id}`))
    }

    users.splice(userIndex, 1)

    res.status(HttpStatus.NoContent).send()
}

function login(req, res, next) {
    const {email, password} = req.body

    const identifiedUser = users.find(u => u.email === email)
    if (!identifiedUser || identifiedUser.password !== password) {
        return next(new HttpError(HttpStatus.Unauthorized, `Could not identify user. Credentials seem to be wrong`))
    }

    return res.json({message: "Logged in successfully."})
}

module.exports = {
    getAll,
    getById,
    createUser,
    editUser,
    deleteUser,
    login,
}