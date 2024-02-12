
const jwt = require('jsonwebtoken')

const jwtMiddleWare = (req,res,next)=>{
    console.log('inside jwt middleWare');
    const token = req.headers['authorization'].split(' ')[1] 
    console.log(token);
    try
    {
        const jwtResponse = jwt.verify(token,"supersecretekey12345") 
        console.log(jwtResponse);
        req.payload = jwtResponse.userId
        next();
        
    }
    catch(err)
    {
        res.status(401).json('Authorization failed .... please login')
    }
    
}

module.exports = jwtMiddleWare