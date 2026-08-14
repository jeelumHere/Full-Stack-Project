import fileModel from "../models/file.model.js"
import * as officeService from "../services/office.service.js"


export async function uploadFile(req, res) {
    try {

        const user = req.user
        const { parentFolder, folder } = req.body

        if (!parentFolder || !folder || !req.file) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }

        const result = await officeService.uploadToB2(req.file, user)

        const newFile = [{
            publicId: result,
            name: req.file.originalname,
            fileSize: req.file.size,
            folder: user.username
        }]

        // 4. Atomic push — no race condition, no read-modify-write
        const updatedData = await fileModel.findOneAndUpdate(
            { user: user._id, parentFolder, folder },
            { $push: { files: { $each: newFile } } },
            { upsert: true, returnDocument: "after" }
        );


        return res.status(201).json({ message: "File uploaded successfully", file: newFile })
    } catch (err) {
        return res.status(500).json({ message: 'Server Error', error: err.message })
    }
}
export async function url(req, res) {
    try {
        const { key } = req.body
        if (!key) {
            return res.status(400).json({
                message: "Url not found"
            })
        }
        const url = await officeService.getFileUrl(key)
        return res.status(200).json({
            url: url
        })
    }
    catch (err) {
        return res.status(500).json({ message: 'Server Error', error: err.message })
    }
}