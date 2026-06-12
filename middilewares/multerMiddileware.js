// ============================================================
// multerMiddileware.js  — UPDATED TO USE CLOUDINARY
// ============================================================
// WHAT CHANGED vs the old file:
//   OLD: files were saved to a local "./uploads" folder on the server
//   NEW: files are sent directly to Cloudinary (cloud storage)
//        so they are NEVER lost when Render restarts or redeploys.
//
// HOW IT WORKS:
//   multer         → handles the incoming file from the request
//   cloudinary     → the cloud service that permanently stores the image
//   multer-storage-cloudinary → connects multer with cloudinary together
// ============================================================

// Step 1: import cloudinary (the SDK - Software Development Kit)
const cloudinary = require('cloudinary')

// Step 2: import the special storage engine that links multer + cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Step 3: import multer (same as before)
const multer = require('multer')

// ---------------------------------------------------------------
// Step 4: Configure cloudinary with YOUR account credentials
//         These values come from your .env file (never hardcode them!)
//         You got these keys when you created your Cloudinary account.
// ---------------------------------------------------------------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // e.g. "myapp123"
    api_key: process.env.CLOUDINARY_API_KEY,         // e.g. "123456789012345"
    api_secret: process.env.CLOUDINARY_API_SECRET    // e.g. "abcdefg_hijklmno"
})

// ---------------------------------------------------------------
// Step 5: Create the Cloudinary storage configuration
//         This tells multer: "instead of saving to disk,
//         upload the file to Cloudinary"
// ---------------------------------------------------------------
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // use the cloudinary we configured above

    params: {
        folder: 'transist_alert_hub', // folder name inside your Cloudinary account
                                       // all images will be grouped here

        allowed_formats: ['jpg', 'jpeg', 'png'], // only allow these image types

        // Give each uploaded file a unique name using the current timestamp
        // This prevents two files from having the same name
        public_id: (req, file) => {
            return `image-${Date.now()}-${file.originalname.split('.')[0]}`
        }
    }
})

// ---------------------------------------------------------------
// Step 6: File type filter (same as before — extra safety check)
//         Even though Cloudinary checks format, we also check here
// ---------------------------------------------------------------
const fileFilter = (req, file, callback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        callback(null, true)   // accept the file
    } else {
        callback(null, false)
        return callback(new Error('Only png, jpg, jpeg files are allowed'))
    }
}

// ---------------------------------------------------------------
// Step 7: Create the final multer config using Cloudinary storage
//         (same structure as before, just storage is now Cloudinary)
// ---------------------------------------------------------------
const multerConfig = multer({
    storage,    // cloudinary storage (was: diskStorage)
    fileFilter  // same file type check as before
})

// Export so router.js can use it
module.exports = multerConfig
