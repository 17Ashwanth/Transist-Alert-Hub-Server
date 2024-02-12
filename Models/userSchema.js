// import mongoose
const mongoose = require('mongoose')


//schema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:[3,'Must be atleast 3 charcters,but go {VALUE}']
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validator(value){
         if(!validator.isEmail(value)){
            throw new Error('Invalid Email')
         }
        }
    },
    password:{
        type:String,
        require:true
    },
    profile:{
        type:String,
    }
})

const users = mongoose.model("users",userSchema)

//export model
module.exports= users