
const reports = require('../Models/reportSchema')

exports.addReport = async(req,res)=>{
    console.log('inside the report controller');
    const userId = req.payload
    console.log(userId);

    const reportImage = req.file.filename
    console.log(reportImage);

    const {title,date,location,overview}=req.body
    console.log(`${title},${date},${location},${overview},${reportImage},${userId}`);

    try {
        const report = new reports({
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
// home reports
exports.getHomeReports = async(req,res)=>{
    try {
    const homeReports = await reports.find().limit(3)
    res.status(200).json(homeReports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

//Get All reports

exports.getAllreports = async(req,res)=>{
    const searchKey = req.query.search
    console.log(searchKey); 

    const query ={
        title:{
            // regular expression, option:'i': it removes case sensitvies
            $regex:searchKey
        }
    } 

    try {
    const allreports = await reports.find(query )
    res.status(200).json(allreports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

//Get Users reports

exports.getUserReports = async(req,res)=>{
    try {
        const userId = req.payload
        const userReports = await reports.find({userId})
        res.status(200).json(userReports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

//edit user report
exports.editUserReport = async(req,res)=>{
    const{id}= req.params
    const userId = req.payload
    const {title,date,location,overview,reportImage}= req.body
    const uploadedReportImage = req.file?req.file.filename:reportImage

    try {
        const updateReport = await reports.findByIdAndUpdate({_id:id},{title,date,location,overview,reportImage:uploadedReportImage,userId},{new:true})

        await updateReport.save(
            res.status(200).json(updateReport)
        )

    } catch (err) {
        res.status(401).json(err)
        
    }
}

//delete user report
exports.deleteUserReport=async(req,res)=> {
    const {id} = req.params
    try {
        const removeReport= await reports.findByIdAndDelete({_id:id})
        res.status(200).json(removeReport)
    } catch (err) {
        res.status(401).json(err)
    }
}