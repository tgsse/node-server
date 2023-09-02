const {Router} = require('express')

const usersController = require("../../controller/usersController")

const usersRouter = Router()

usersRouter.get('/', usersController.getAll)

usersRouter.get('/:id', usersController.getById)

usersRouter.post('/', usersController.createUser)

usersRouter.patch('/:id', usersController.editUser)

usersRouter.delete('/:id', usersController.deleteUser)

usersRouter.post('/login', usersController.login)

module.exports = usersRouter