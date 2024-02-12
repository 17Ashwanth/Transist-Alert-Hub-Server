//1) import dotenv
require('dotenv').config()

//2) import express
const express = require('express')

//3) import cors
const cors = require('cors')

// import router
const router = require('./Routing/router')

// import connection.js
require('./Database/connection')

//4) create server
const tahServer = express()

//5) use of cors by server
tahServer.use(cors())

//6) parsing json
tahServer.use(express.json())

//server using router
tahServer.use(router)

//pfServer uuse upload folder
tahServer.use('/uploads',express.static('./uploads'))

//7) customize port
const PORT = 5000 || process.env

//8) run server
tahServer.listen(PORT,()=>{
    console.log(`Server Running succesfully at port number ${PORT}`);
})

// get request
tahServer.get('/',(req,res)=>{
    res.send('project fair server running successfully and ready to accept client request')
})