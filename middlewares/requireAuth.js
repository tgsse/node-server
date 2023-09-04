const jwt = require('jsonwebtoken')

const HttpError = require('../util/errors/HttpError')
const { HttpStatus } = require('../util/enums')

function requireAuth(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new HttpError(HttpStatus.Unauthorized, 'Authentication failed.')
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            throw new HttpError(HttpStatus.Unauthorized, 'Authentication failed.')
        }
        const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_PRIVATE_KEY)
        req.userData = {userId: decodedToken.userId}
        next()
    } catch (e) {
        next(e)
    }
}

module.exports = requireAuth