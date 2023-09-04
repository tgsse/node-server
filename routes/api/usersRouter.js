const { Router } = require('express')
const { check, oneOf } = require('express-validator')

const usersController = require('../../controller/usersController')
const { MIN_PASSWORD_LENGTH } = require('../../util/constants')
const requireAuth = require('../../middlewares/requireAuth')

const usersRouter = Router()

usersRouter.post(
    '/',
    check('name').not().isEmpty(),
    check('email')
        .not()
        .isEmpty()
        .normalizeEmail({ gmail_remove_dots: false })
        .isEmail(),
    check('password').isLength({ min: MIN_PASSWORD_LENGTH }),
    usersController.createUser
)

usersRouter.post(
    '/login',
    check('email')
        .not()
        .isEmpty()
        .normalizeEmail({ gmail_remove_dots: false })
        .isEmail(),
    check('password').not().isEmpty().isLength({ min: MIN_PASSWORD_LENGTH }),
    usersController.login
)
usersRouter.post(
    '/logout',
    check(['email'])
        .not()
        .isEmpty()
        .normalizeEmail({ gmail_remove_dots: false })
        .isEmail(),
    usersController.logout
)

usersRouter.use(requireAuth)

usersRouter.get('/', usersController.getAll)

usersRouter.get('/:id', usersController.getById)

usersRouter.patch(
    '/:id',
    oneOf([check('name').not().isEmpty(), check('password').not().isEmpty()]),
    usersController.editUser
)

usersRouter.delete('/:id', usersController.deleteUser)

module.exports = usersRouter
