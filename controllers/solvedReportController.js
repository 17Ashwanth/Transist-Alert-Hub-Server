const solvedReports = require('../Models/solvedReportsSchema')

exports.getAllSolvedReports = async(req,res)=>{
    const searchKey = req.query.search
    console.log(searchKey); 

    const query ={
        date:{
            // regular expression, option:'i': it removes case sensitvies
            $regex:searchKey
        }
    } 

    try {
    const allsolvedreports = await solvedReports.find(query )
    res.status(200).json(allsolvedreports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

exports.addSolvedReport = async(req,res)=>{
    console.log('inside the report controller');
    const userId = req.payload
    console.log(userId);

    

    const {title,date,location,overview,reportImage}= req.body


    try {
        const report = new solvedReports({
            title,
            date,
            location,
            overview,
            reportImage,
            userId

        })
        await report.save()
        res.status(200).json(report)
    } catch (err) {
        res.status(401).json(`Register request Failed due to,${err}`) 
    }

}

//delete admin solved report
exports.deleteSolvedReport=async(req,res)=> {
    const {id} = req.params
    try {
        const removeReport= await solvedReports.findByIdAndDelete({_id:id})
        res.status(200).json(removeReport)
    } catch (err) {
        res.status(401).json(err)
    }
}