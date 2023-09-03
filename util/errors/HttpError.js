const {HttpStatus} = require("../constants")

class HttpError extends Error {
    constructor(code, message) {
        super(message)
        this.code = code
    }

    static notFound = (target) => new HttpError(HttpStatus.NotFound, `Could not find ${target}.`)
    static serverError = () => new HttpError(HttpStatus.InternalServerError, `Something went wrong. Please try again.`)
}

module.exports = HttpError