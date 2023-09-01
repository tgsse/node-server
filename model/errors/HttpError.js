class HttpError extends Error {
    constructor(code, message) {
        super(message)
        this.code = code
    }

    static NotFound = (target) => new HttpError(404, `Could not find ${target}.`)
}

module.exports = HttpError