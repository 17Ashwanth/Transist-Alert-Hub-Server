// ============================================================
// userController.js  — UPDATED TO USE CLOUDINARY
// ============================================================
// WHAT CHANGED vs the old file:
//   Only ONE small change in the editUser function:
//   OLD: profileImage = req.file.filename  (local filename)
//   NEW: profileImage = req.file.path      (full Cloudinary URL)
//
// Everything else (register, login) is exactly the same.
// ============================================================

const users = require('../Models/userSchema')
const jwt = require('jsonwebtoken')

// ---------------------------------------------------------------
// REGISTER a new user (no image upload here — no changes)
// ---------------------------------------------------------------
exports.register = async (req, res) => {
    console.log(`inside controller register function`);
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

// ---------------------------------------------------------------
// LOGIN (no image upload here — no changes)
// ---------------------------------------------------------------
exports.login = async (req, res) => {
    console.log(`inside controller login function`);
    const { email, password } = req.body

    try {
        const existsUser = await users.findOne({ email, password })
        console.log(existsUser);

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

// ---------------------------------------------------------------
// EDIT user profile (profile image upload)
// ---------------------------------------------------------------
exports.editUser = async (req, res) => {
    const userId = req.payload
    const { username, email, password, profile } = req.body

    // CHANGED: was req.file.filename  →  now req.file.path
    // If a new profile image was uploaded → use the Cloudinary URL (req.file.path)
    // If no new image uploaded → keep the existing profile URL from req.body
    const profileImage = req.file ? req.file.path : profile

    try {
        const updateUser = await users.findByIdAndUpdate(
            { _id: userId },
            { username, email, password, profile: profileImage },
            { new: true }
        )
        await updateUser.save()
        res.status(200).json(updateUser)
    } catch (err) {
        res.status(401).json(err)
    }
}
