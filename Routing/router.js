// to set path to resolve request

//1) import express
const express = require('express')

// import user controller
const userController = require('../controllers/userController')

// import report controller
const reportController = require('../controllers/reportController')

// import solved controller
const solvedController = require("../controllers/solvedReportController")

// import middileware
const jwtMiddleWare = require('../middilewares/jwtMiddileware')

//import multer 
const multerConfig = require('../middilewares/multerMiddileware')

//2) create object for Router()
const router = new express.Router()

//3) logic
    // synatx router.http req('path',()=>{how to solve})
    //a) register
            router.post('/user/register',userController.register)
    //b) login
            router.post('/user/login',userController.login)
    //c) Add Report
        router.post('/report/add',jwtMiddleWare,multerConfig.single("reportImage"),reportController.addReport)

     // d- home report
     router.get("/report/home-report",reportController.getHomeReports)

     // e-  all report
          router.get("/report/all-report",jwtMiddleWare,reportController.getAllreports)
 
     // f- userreport
          router.get("/user/all-report",jwtMiddleWare,reportController.getUserReports)

     // g) edit report
     router.put('/report/edit/:id',jwtMiddleWare,multerConfig.single('reportImage'),reportController.editUserReport)  
     
     // f) delete user report
     router.delete('/report/remove/:id',jwtMiddleWare,reportController.deleteUserReport) 
     
     // g) edit profile
     router.put('/user/edit',jwtMiddleWare,multerConfig.single('profile'),userController.editUser)

     // h) getsolvedreports
     router.get('/solvedreport',jwtMiddleWare,solvedController.getAllSolvedReports)

     // i) addto solved report
     router.post('/solved-report/add',jwtMiddleWare,solvedController.addSolvedReport)

     // f) delete solved report
     router.delete('/solved-report/remove/:id',jwtMiddleWare,solvedController.deleteSolvedReport) 


//4) export router
module.exports = router