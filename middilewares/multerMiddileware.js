const cloudinary = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// Configure cloudinary v1
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Create Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'transist_alert_hub',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => {
            return `image-${Date.now()}-${file.originalname.split('.')[0]}`
        }
    }
})

// File type filter
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