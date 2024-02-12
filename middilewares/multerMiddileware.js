// import multer

const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')// the file will be stored in uplods folder
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}-${file.originalname}`
        callback(null,filename)
    }
})

const fileFilter = (req,file,callback)=>{
    // mimetype is used to set the type of file
    if( file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' )
    {
        callback(null,true)
    }
    else
    {
        callback(null,false)
        return callback(new Error("only png,jpg,jpeg files are allowed"))
    }
}

const multerConfig = multer({
    storage,//where the file is stored
    fileFilter// which all file can be stored
})

module.exports = multerConfig