// import mangoose
const mongoose = require('mongoose')

// get the connectionsTring 
const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('server connected succesfully mongodb');
}).catch((err)=>{
    console.log(`mongodb failed to connect due to ${err}`);
})