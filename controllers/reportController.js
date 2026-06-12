// ============================================================
// reportController.js  — UPDATED TO USE CLOUDINARY
// ============================================================
// WHAT CHANGED vs the old file:
//
//   OLD:  reportImage = req.file.filename
//         → this was just a filename like "image-1234567-photo.jpg"
//         → the full URL was built on the frontend as:
//           "http://yourserver.com/uploads/image-1234567-photo.jpg"
//         → PROBLEM: when Render restarted, the uploads folder was wiped!
//
//   NEW:  reportImage = req.file.path
//         → this is now the FULL Cloudinary URL like:
//           "https://res.cloudinary.com/yourname/image/upload/v123/transist_alert_hub/image-1234567.jpg"
//         → PERMANENT: stored on Cloudinary's servers, never deleted
//
// Summary: Only 2 small changes in this file:
//   1. req.file.filename  →  req.file.path   (in addReport)
//   2. req.file.filename  →  req.file.path   (in editUserReport)
// ============================================================

const reports = require('../Models/reportSchema')

// ---------------------------------------------------------------
// ADD a new report (with image upload)
// ---------------------------------------------------------------
exports.addReport = async (req, res) => {
    console.log('inside the report controller');
    const userId = req.payload
    console.log(userId);

    // CHANGED: was req.file.filename (just a name like "image-123.jpg")
    //          now req.file.path (full Cloudinary URL like "https://res.cloudinary.com/...")
    const reportImage = req.file.path
    console.log(reportImage);

    const { title, date, location, overview } = req.body
    console.log(`${title},${date},${location},${overview},${reportImage},${userId}`);

    try {
        const report = new reports({
            title,
            date,
            location,
            overview,
            reportImage,  // now stores the full Cloudinary URL
            userId
        })
        await report.save()
        res.status(200).json(report)
    } catch (err) {
        res.status(401).json(`Register request Failed due to,${err}`)
    }
}

// ---------------------------------------------------------------
// GET home reports (no image changes needed here)
// ---------------------------------------------------------------
exports.getHomeReports = async (req, res) => {
    try {
        const homeReports = await reports.find().limit(3)
        res.status(200).json(homeReports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

// ---------------------------------------------------------------
// GET all reports (no image changes needed here)
// ---------------------------------------------------------------
exports.getAllreports = async (req, res) => {
    const searchKey = req.query.search
    console.log(searchKey);

    const query = {
        title: {
            // regular expression, option:'i': removes case sensitivity
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

// ---------------------------------------------------------------
// GET user's own reports (no image changes needed here)
// ---------------------------------------------------------------
exports.getUserReports = async (req, res) => {
    try {
        const userId = req.payload
        const userReports = await reports.find({ userId })
        res.status(200).json(userReports)
    } catch (err) {
        res.status(401).json(`Request failed due to ${err}`)
    }
}

// ---------------------------------------------------------------
// EDIT a user's report (with optional new image)
// ---------------------------------------------------------------
exports.editUserReport = async (req, res) => {
    const { id } = req.params
    const userId = req.payload
    const { title, date, location, overview, reportImage } = req.body

    // CHANGED: was req.file.filename  →  now req.file.path
    // If a new image was uploaded, use its Cloudinary URL (req.file.path)
    // If no new image, keep the old one that was sent in req.body
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

// ---------------------------------------------------------------
// DELETE a user's report (no image changes needed here)
// ---------------------------------------------------------------
exports.deleteUserReport = async (req, res) => {
    const { id } = req.params
    try {
        const removeReport = await reports.findByIdAndDelete({ _id: id })
        res.status(200).json(removeReport)
    } catch (err) {
        res.status(401).json(err)
    }
}
