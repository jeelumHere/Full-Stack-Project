import * as imageKit from "../services/image.service.js"
import imageModel from "../models/image.model.js"
import userModel from "../models/user.model.js"


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


        const myImages = result.map(ele => ({ url: ele.url, fileId: ele.fileId, name: ele.name }))


        const data01 = await imageModel.find({ user: user._id, parentFolder: parentFolder, folder: folder })

        const oldImages = data01.flatMap(ele => ele.images)
        const combinedImages = [...myImages, ...oldImages]
        const data = await imageModel.findOneAndUpdate({ user: user._id, parentFolder: parentFolder, folder: folder }, {
            images: combinedImages,
        }, {
            upsert: true, returnDocument: "after",
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

export async function deleteFolder(req, res) {
    try {
        const user = req.user;
        const { parentFolder } = req.body

        const data = await imageModel.find(
            { user: user._id, parentFolder: parentFolder }
        )

        const fileIds = data.flatMap(ele =>
            ele.images.map(e => e.fileId)
        );

        const result = await imageKit.deleteFile(fileIds)

        await imageModel.deleteMany(
            { user: user._id, parentFolder: parentFolder }
        )




        return res.status(200).json({
            message: "All data has been cleared from the folder"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function deleteSubFolder(req, res) {
    try {
        const user = req.user;
        const { folder, parentFolder } = req.body

        const data = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder }
        )

        const fileIds = data.flatMap(ele =>
            ele.images.map(e => e.fileId)
        );

        const result = await imageKit.deleteFile(fileIds)

        await imageModel.deleteMany(
            { user: user._id, parentFolder: parentFolder, folder: folder }
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

export async function deleteImages(req, res) {
    try {

        const user = req.user

        const { folder, parentFolder } = req.body
        const fileIds = JSON.parse(req.body.fileIds);

        const imageData = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder }
        )

        const updatedImages = imageData.flatMap(ele => (ele.images.filter(
            image => !fileIds.includes(image.fileId)
        )))
        console.log(updatedImages);

        const newImageData = await imageModel.findOneAndUpdate(
            { user: user._id, parentFolder: parentFolder, folder: folder },
            { images: updatedImages },
            { upsert: true, returnDocument: "after", }
        )

        if (updatedImages.length === 0) {
            await imageModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder })
        }

        console.log(fileIds)
        const result = await imageKit.deleteFile(fileIds)

        return res.status(200).json({
            message: "Files deleted Successfully",
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}