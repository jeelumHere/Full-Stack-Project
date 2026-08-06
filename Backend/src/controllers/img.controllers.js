import * as imageKit from "../services/image.service.js"
import imageModel from "../models/image.model.js"
import userModel from "../models/user.model.js"
import { json } from "express"


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
        console.log(fileIds);

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

        const imageData01 = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" }
        )
        const imageData02 = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" }
        )
        console.log("imageData01 "+imageData01 );
        console.log("imageData02 " + imageData02);

        const updatedImages01 = imageData01.flatMap(ele => (ele.images.filter(
            image => !fileIds.includes(image.fileId)
        )))
        const updatedImages02 = imageData02.flatMap(ele => (ele.images.filter(
            image => !fileIds.includes(image.fileId)
        )))

        console.log("updatedImages01 "+updatedImages01);
        console.log("updatedImages02 "+updatedImages02);

        const newImageData01 = await imageModel.findOneAndUpdate(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" },
            { images: updatedImages01 },
            { upsert: true, returnDocument: "after", }
        )

        const newImageData02 = await imageModel.findOneAndUpdate(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" },
            { images: updatedImages02 },
            { upsert: true, returnDocument: "after", }
        )

        if (updatedImages01.length === 0) {
            await imageModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder ,visibility: "Private"})
        }
        if (updatedImages02.length === 0) {
            await imageModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder ,visibility: "Public"})
        }

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

export async function getImages(req, res) {
    try {
        const user = req.user;
        const { parentFolder, folder } = req.body

        const allImages = await imageModel.find({ user: user._id, parentFolder: parentFolder, folder: folder })

        let data = allImages
        const onlyImages = allImages.flatMap(ele => (ele.images))

        console.log(onlyImages);

        return res.status(200).json({
            message: "Data received successfully",
            Data: data,
            images: onlyImages
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message,
        })
    }
}

export async function uploadPublicImages(req, res) {

    try {

        const user = req.user
        const { parentFolder, folder } = req.body

        const images = JSON.parse(req.body.images);

        if (!parentFolder || !folder || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                message: "Provide required credentials"
            });
        }



        const data01 = await imageModel.find({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" })

        const oldImages = data01.flatMap(ele => ele.images)

        const combinedImages = Array.from(
            new Map([...oldImages, ...images].map(img => [img.fileId.toString(), img])).values()
        )

        const globalImages = await imageModel.findOneAndUpdate(
            {
                visibility: "Public",
                user: user._id,
                parentFolder,
                folder,
            },
            { images: combinedImages },
            { upsert: true, new: true }
        );

        return res.status(201).json({
            message: "Images uploaded successfully",
            globalImages: globalImages
        })
    }

    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }

}