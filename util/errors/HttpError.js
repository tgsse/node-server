const {HttpStatus} = require("../constants")

class HttpError extends Error {
    constructor(code, message) {
        super(message)
        this.code = code
    }

    static notFound = (target) => new HttpError(HttpStatus.NotFound, `Could not find ${target}.`)
}

module.exports = HttpError