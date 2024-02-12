//import mongoose
const mongoose = require('mongoose')

//report schema
const reportSchema = mongoose.Schema({
    title:{
        type: String,
        require:true
    },
    date:{
        type: String,
        require:true
    },
    location:{
        type: String,
        require:true
    },
    overview:{
        type: String,
        require:true
    },
    reportImage:{
        type: String,
        require:true
    },
    userId:{
        type: String,
        require:true
    },
    username:{
        type: String,
        require:true
    }
})

//create modal
const reports = mongoose.model("reports",reportSchema)

//export model
module.exports = reports