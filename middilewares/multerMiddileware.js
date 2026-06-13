const cloudinary = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME)
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY)
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'EXISTS' : 'MISSING')

try {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    console.log('Cloudinary config success!')
} catch(err) {
    console.log('Cloudinary config ERROR:', err)
}

let storage;
try {
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'transist_alert_hub',
            allowed_formats: ['jpg', 'jpeg', 'png'],
            public_id: (req, file) => {
                return `image-${Date.now()}-${file.originalname.split('.')[0]}`
            }
        }
    })
    console.log('CloudinaryStorage created successfully!')
} catch(err) {
    console.log('CloudinaryStorage ERROR:', err)
}

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