import * as imageKit from "../services/image.service.js"
import imageModel from "../models/image.model.js"


export async function uploadImages(req, res) {
    try {
        const files = req.files
        const user = req.user
        const { parentFolder, folder } = req.body
        if (!files) {
            return res.status(400).json({
                message: "file not found"
            })
        }

        const result = await Promise.all(
            files.map(ele => (imageKit.uploadFile(ele)))
        )

        console.log(result);
        const myImages = result.map(ele => ({ url: ele.url, fileId: ele.fileId, name: ele.name }))
        console.log(myImages);

        const images = await imageModel.create({
            user: user._id,
            images: myImages,
            parentFolder: parentFolder,
            folder: folder
        })
        return res.status(201).json({
            message: "File uploaded successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function deleteImages(req, res) {
    try {
        const user = req.user;
        const { folder, parentFolder } = req.body

        const data = await imageModel.find(
            { user: user._id, parentFolder: parentFolder}
        )

        const fileIds = data.flatMap(ele =>
            ele.images.map(e => e.fileId)
        );

        const result = await imageKit.deleteFile(fileIds)

        await imageModel.deleteMany(
            { user: user._id, parentFolder: parentFolder}
        )




        return res.status(200).json({
            message: "Files deleted Successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}