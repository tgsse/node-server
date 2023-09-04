const multer = require('multer')
const { MAX_UPLOAD_FILE_SIZE } = require('../util/constants')
const HttpError = require('../util/errors/HttpError')
const { HttpStatus } = require('../util/enums')
const uuid = require('uuid').v1

const mimeTypeMap = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

// noinspection JSUnusedGlobalSymbols
const fileUpload = multer({
    limits: MAX_UPLOAD_FILE_SIZE,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images')
        },
        filename: (req, file, cb) => {
            const ext = mimeTypeMap[file.mimetype]
            console.log(ext)
            console.log(file)
            cb(null, `${uuid()}.${ext}`)
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!mimeTypeMap[file.mimetype]
        const error = isValid
            ? null
            : new HttpError(
                  HttpStatus.UnprocessableEntity,
                  `Invalid mime type. Mime type has to be one of ${Object.keys(
                      mimeTypeMap
                  )}`
              )
        cb(error, isValid)
    },
})

module.exports = fileUpload
