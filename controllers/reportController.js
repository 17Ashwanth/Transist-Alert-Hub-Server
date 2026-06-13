const reports = require('../Models/reportSchema')
const cloudinary = require('cloudinary').v2

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Helper function to upload buffer to cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: 'transist_alert_hub',
                timeout: 60000
            },
            (error, result) => {
                if (error) {
                    console.log('Cloudinary upload error:', error)
                    reject(error)
                } else {
                    console.log('Cloudinary upload success:', result.secure_url)
                    resolve(result)
                }
            }
        )
        stream.end(buffer)
    })
}

exports.addReport = async (req, res) => {
    console.log('inside the report controller')

    if(!req.file) {
        return res.status(500).json('No image file received')
    }

    try {
        console.log('Starting Cloudinary upload...')
        const uploadResult = await uploadToCloudinary(req.file.buffer)
        console.log('Cloudinary done:', uploadResult.secure_url)

        const reportImage = uploadResult.secure_url
        const userId = req.payload
        const { title, date, location, overview } = req.body

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
        console.log('FULL ERROR:', err)
        res.status(500).json(`Failed: ${err.message}`)
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
    const query = { title: { $regex: searchKey } }
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

    try {
        let uploadedReportImage = reportImage

        if(req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer)
            uploadedReportImage = uploadResult.secure_url
        }

        const updateReport = await reports.findByIdAndUpdate(
            { _id: id },
            { title, date, location, overview, reportImage: uploadedReportImage, userId },
            { new: true }
        )
        await updateReport.save(
            res.status(200).json(updateReport)
        )
    } catch (err) {
        console.log('ERROR:', err)
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