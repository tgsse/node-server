const {HttpStatus} = require("../../util/constants")

class HttpError extends Error {
    constructor(code, message) {
        super(message)
        this.code = code
    }

    static NotFound = (target) => new HttpError(HttpStatus.NotFound, `Could not find ${target}.`)
}

module.exports = HttpError