const {Router} = require('express')
const {check} = require('express-validator')

const usersController = require("../../controller/usersController")

const usersRouter = Router()

usersRouter.get('/', usersController.getAll)

usersRouter.get('/:id', usersController.getById)

usersRouter.post(
    '/',
    check(['name', 'email', 'password']).not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6}),
    usersController.createUser)

usersRouter.patch('/:id', usersController.editUser)

usersRouter.delete('/:id', usersController.deleteUser)

usersRouter.post('/login', usersController.login)

module.exports = usersRouter