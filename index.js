// ============================================================
// index.js  — UPDATED TO USE CLOUDINARY
// ============================================================
// WHAT CHANGED vs the old file:
//   REMOVED these lines (no longer needed!):
//     const fs = require('fs')
//     if (!fs.existsSync('./uploads')) { fs.mkdirSync('./uploads', ...) }
//     console.log("Uploads exists:", ...)
//     tahServer.use('/uploads', express.static('./uploads'))
//
//   WHY removed? Because with Cloudinary, images are stored in the cloud.
//   We no longer need a local "uploads" folder on the server at all.
//   Images now have their own permanent Cloudinary URLs.
//
// Everything else is the same.
// ============================================================

// 1) Load environment variables from .env file
require('dotenv').config()

// 2) Import express
const express = require('express')

// 3) Import cors (allows frontend to talk to this backend)
const cors = require('cors')

// Import router
const router = require('./Routing/router')

// Import database connection
require('./Database/connection')

// 4) Create server
const tahServer = express()

// 5) Use cors
tahServer.use(cors())

// 6) Parse incoming JSON data
tahServer.use(express.json())

// Server uses router for all routes
tahServer.use(router)

// NOTE: We REMOVED the local uploads folder setup and express.static('/uploads')
//       because images are now stored on Cloudinary, not on this server.

// 7) Set port (from .env or default 5000)
const PORT = process.env.PORT || 5000

// 8) Start server
tahServer.listen(PORT, () => {
    console.log(`Server Running successfully at port number ${PORT}`)
})

// Health check route
tahServer.get('/', (req, res) => {
    res.send('Transist Alert Hub server running successfully and ready to accept client requests')
})
