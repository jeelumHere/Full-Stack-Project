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

        const result = await fileService.uploadFile(req.file.buffer, req.file.originalname, user.username)

        const newFile = [{
            url: result.secure_url,
            publicId: result.public_id,
            name: result.display_name,
            fileSize: result.bytes,
            folder: result.asset_folder
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
        const user = req.user

        const { parentFolder, folder } = req.body
        const publicIds = JSON.parse(req.body.publicIds);

        if (!parentFolder || !folder || publicIds.length === 0) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }


        const fileData01 = await fileModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" }
        )
        if(fileData01.length===0){
            return res.status(403).json({
                message : "Data not found in the database"
            })
        }
        
        const fileData02 = await fileModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" }
        )
        
        const updatedFiles01 = fileData01.flatMap(ele => (ele.files.filter(
            file => !publicIds.includes(file.publicId)
        )))
        
        
        const updatedFiles02 = fileData02.flatMap(ele => (ele.files.filter(
            file => !publicIds.includes(file.publicId)
        )))
        
        const newFilesData01 = await fileModel.findOneAndUpdate(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" },
            { files: updatedFiles01 },
            { upsert: true, returnDocument: "after", }
        )
    

        const newFilesData02 = await fileModel.findOneAndUpdate(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" },
            { files: updatedFiles02 },
            { upsert: true, returnDocument: "after", }
        )


        if (updatedFiles01.length === 0) {
            await fileModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" })
        }
        if (updatedFiles02.length === 0) {
            await fileModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" })
        }


        const cloudResult = await fileService.deletePdfs(publicIds);

        const failed = Object.entries(cloudResult.deleted || {})
            .filter(([_, status]) => status !== 'deleted')
            .map(([id]) => id);

        if (cloudResult.partial || failed.length > 0) {
            return res.status(500).json({
                message: 'Some files failed to delete from Cloudinary',
                failed,
                cloudResult
            });
        }
        return res.status(200).json({ message: 'PDFs deleted' });
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}