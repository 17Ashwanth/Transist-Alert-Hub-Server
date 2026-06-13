const multer = require('multer')

// Use memory storage instead of disk or cloudinary storage
// This stores the file in memory as a buffer
// Then we upload to cloudinary manually in the controller
const storage = multer.memoryStorage()

const fileFilter = (req, file, callback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
        return callback(new Error('Only png, jpg, jpeg files are allowed'))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig