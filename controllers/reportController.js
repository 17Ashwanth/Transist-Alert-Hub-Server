const reports = require('../Models/reportSchema')

exports.addReport = async (req, res) => {
    console.log('inside the report controller')
    console.log('req.file:', req.file)

    if(!req.file) {
        console.log('ERROR: req.file is undefined - image upload to Cloudinary failed')
        return res.status(500).json('Image upload to Cloudinary failed')
    }

    const userId = req.payload
    console.log('userId:', userId)

    const reportImage = req.file.path
    console.log('reportImage URL:', reportImage)

    const { title, date, location, overview } = req.body
    console.log(`title:${title}, location:${location}, overview:${overview}`)

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
        console.log('DB SAVE ERROR:', err)
        res.status(401).json(`Register request Failed due to,${err}`)
    }
}

exports.getHomeReports = async (req, res) => {
    try {
        const homeReports = await reports.find().limit(3)
        res.status(200).json(homeReports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

exports.getAllreports = async (req, res) => {
    const searchKey = req.query.search
    console.log(searchKey)

    const query = {
        title: {
            $regex: searchKey
        }
    }

    try {
        const allreports = await reports.find(query)
        res.status(200).json(allreports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

exports.getUserReports = async (req, res) => {
    try {
        const userId = req.payload
        const userReports = await reports.find({ userId })
        res.status(200).json(userReports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

exports.editUserReport = async (req, res) => {
    const { id } = req.params
    const userId = req.payload
    const { title, date, location, overview, reportImage } = req.body

    const uploadedReportImage = req.file ? req.file.path : reportImage

    try {
        const updateReport = await reports.findByIdAndUpdate(
            { _id: id },
            { title, date, location, overview, reportImage: uploadedReportImage, userId },
            { new: true }
        )
        await updateReport.save(
            res.status(200).json(updateReport)
        )
    } catch (err) {
        res.status(401).json(err)
    }
}

exports.deleteUserReport = async (req, res) => {
    const { id } = req.params
    try {
        const removeReport = await reports.findByIdAndDelete({ _id: id })
        res.status(200).json(removeReport)
    } catch (err) {
        res.status(401).json(err)
    }
}