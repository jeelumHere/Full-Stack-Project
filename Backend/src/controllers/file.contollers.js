import * as fileService from "../services/file.service.js"


export async function uploadFile(req, res) {
    try {
        const result = await fileService.uploadFile(req.file.buffer, req.file.originalname)
        console.log(result);
        return res.status(201).json({ message: "File uploaded successfully", })
    } catch (err) {
        return res.status(500).json({ message: 'Server Error', error: err.message })
    }
}

export async function deleteFiles(req, res) {
    try {
        const cloudResult = await fileService.deletePdf('My Pdfs/1786459018126-daniel_hashmi_resume.pdf');
        if (cloudResult.result !== 'ok') {
            return res.status(500).json({ message: 'Failed to delete from Cloudinary', cloudResult });
        }

        return res.json({ message: 'PDF deleted' });
    }
    catch (err) {
        return res.status(500).json({
            error : "Server Error",
            message : err.message
        })
    }
}