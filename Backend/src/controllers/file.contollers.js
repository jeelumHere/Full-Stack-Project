import * as fileService from "../services/file.service.js"
import fileModel from "../models/file.model.js"

export async function uploadFile(req, res) {
    try {

        const user = req.user
        const { parentFolder, folder } = req.body

        if (!parentFolder || !folder || !req.file) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }

        const result = await fileService.uploadFile(req.file.buffer, req.file.originalname,user.username)

        const newFile = [{
            url: result.secure_url,
            publicId: result.public_id,
            name: result.display_name,
            fileSize: result.bytes,
            folder : result.asset_folder
        }]

        // 4. Atomic push — no race condition, no read-modify-write
        const updatedData = await fileModel.findOneAndUpdate(
            { user: user._id, parentFolder, folder },
            { $push: { files: { $each: newFile } } },
            { upsert: true, returnDocument: "after" }
        );


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
            error: "Server Error",
            message: err.message
        })
    }
}