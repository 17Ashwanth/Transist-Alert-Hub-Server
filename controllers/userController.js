const users = require('../Models/userSchema')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Helper function to upload buffer to cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: 'transist_alert_hub',
                timeout: 60000
            },
            (error, result) => {
                if (error) {
                    console.log('Cloudinary upload error:', error)
                    reject(error)
                } else {
                    console.log('Cloudinary upload success:', result.secure_url)
                    resolve(result)
                }
            }
        )
        stream.end(buffer)
    })
}

exports.register = async (req, res) => {
    console.log('inside controller register function')
    const { username, email, password } = req.body
    try {
        const existUser = await users.findOne({ email })
        if (existUser) {
            res.status(406).json('Account already exist...Please login')
        } else {
            const newUser = new users({
                username,
                email,
                password,
                profile: ""
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(`Register request Failed due to,${err}`)
    }
}

exports.login = async (req, res) => {
    console.log('inside controller login function')
    const { email, password } = req.body
    try {
        const existsUser = await users.findOne({ email, password })
        console.log(existsUser)
        if (existsUser) {
            const token = jwt.sign({ userId: existsUser._id }, "supersecretekey12345")
            res.status(200).json({
                existsUser,
                token
            })
        } else {
            res.status(406).json('Invalid Email or Password')
        }
    } catch (err) {
        res.status(401).json(`login failed due to ${err}`)
    }
}

exports.editUser = async (req, res) => {
    const userId = req.payload
    const { username, email, password, profile } = req.body

    try {
        let profileImage = profile  // keep existing image by default

        // If new profile image uploaded, upload to Cloudinary
        if (req.file) {
            console.log('Uploading profile image to Cloudinary...')
            const uploadResult = await uploadToCloudinary(req.file.buffer)
            profileImage = uploadResult.secure_url
            console.log('Profile image uploaded:', profileImage)
        }

        const updateUser = await users.findByIdAndUpdate(
            { _id: userId },
            { username, email, password, profile: profileImage },
            { new: true }
        )
        await updateUser.save()
        res.status(200).json(updateUser)
    } catch (err) {
        console.log('ERROR:', err)
        res.status(401).json(err)
    }
}