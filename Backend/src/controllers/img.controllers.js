import * as imageKit from "../services/image.service.js"
import * as fileService from "../services/file.service.js"
import imageModel from "../models/image.model.js"
import userModel from "../models/user.model.js"
import fileModel from "../models/file.model.js"
// import { json } from "express"


export async function uploadImages(req, res) {
    try {
        const files = req.files
        const user = req.user
        const { parentFolder, folder } = req.body
        if (!parentFolder || !folder || !req.files) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }


        const result = await Promise.all(
            files.map(ele => (imageKit.uploadFile(ele, user)))
        )

        const myImages = result.map(ele => ({ url: ele.url, fileId: ele.fileId, name: ele.name }))


        // 4. Atomic push — no race condition, no read-modify-write
        const updatedData = await imageModel.findOneAndUpdate(
            { user: user._id, parentFolder, folder },
            { $push: { images: { $each: myImages } } },
            { upsert: true, returnDocument: "after" }
        );

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

        const imageData = await imageModel.find(
            { user: user._id, parentFolder: parentFolder }
        )

        const fileIds = imageData.flatMap(ele =>
            ele.images.map(e => e.fileId)
        );
        const fileData = await fileModel.find(
            { user: user._id, parentFolder: parentFolder }
        )

        const publicIds = fileData.flatMap(ele =>
            ele.files.map(e => e.publicId)
        );


        const result = await imageKit.deleteFile(fileIds)
        await fileService.deletePdfs(publicIds)

        await imageModel.deleteMany(
            { user: user._id, parentFolder: parentFolder }
        )
        await fileModel.deleteMany(
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

        const imageData = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder }
        )

        const fileIds = imageData.flatMap(ele =>
            ele.images.map(e => e.fileId)
        );
        const fileData = await fileModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder }
        )

        const publicIds = fileData.flatMap(ele =>
            ele.files.map(e => e.publicId)
        );


        const result = await imageKit.deleteFile(fileIds)
        await fileService.deletePdfs(publicIds)

        await imageModel.deleteMany(
            { user: user._id, parentFolder: parentFolder, folder: folder }
        )
        await fileModel.deleteMany(
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
        const fileIds = typeof req.body.fileIds === 'string'
            ? JSON.parse(req.body.fileIds)
            : req.body.fileIds;

        const imageData01 = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" }
        )
        const imageData02 = await imageModel.find(
            { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" }
        )
        console.log("imageData01 " + imageData01);
        console.log("imageData02 " + imageData02);

        const updatedImages01 = imageData01.flatMap(ele => (ele.images.filter(
            image => !fileIds.includes(image.fileId)
        )))
        const updatedImages02 = imageData02.flatMap(ele => (ele.images.filter(
            image => !fileIds.includes(image.fileId)
        )))

        console.log("updatedImages01 " + updatedImages01);
        console.log("updatedImages02 " + updatedImages02);

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
            await imageModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" })
        }
        if (updatedImages02.length === 0) {
            await imageModel.deleteMany({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" })
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

        if (!parentFolder || !folder) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }

        const allImages = await imageModel.find({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Private" })

        if (allImages.length === 0) {
            return res.status(400).json({
                message: "No Data Found"
            })
        }
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
            { upsert: true, returnDocument: "after" }
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

export async function deletePublicImages(req, res) {
    try {
        const user = req.user
        const { parentFolder, folder } = req.body

        const fileIds = typeof req.body.fileIds === 'string'
            ? JSON.parse(req.body.fileIds)
            : req.body.fileIds;

        if (!parentFolder || !folder || !Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }

        const data = await imageModel.find({ user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" })

        if (!data || data.length === 0) {
            return res.status(401).json({
                message: "No images are found"
            })
        }

        const updatedImages = data.flatMap(ele =>
            ele.images.filter(image => !fileIds.includes(image.fileId.toString()))
        )

        if (updatedImages.length === 0) {
            await imageModel.findOneAndDelete(
                { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" }
            )
        } else {
            await imageModel.findOneAndUpdate(
                { user: user._id, parentFolder: parentFolder, folder: folder, visibility: "Public" },
                { images: updatedImages },
                { new: true }
            )
        }

        return res.status(200).json({
            message: "Public Data deleted successfully"
        })

    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function getPublicImages(req, res) {
    try {
        const user = req.user;
        const { parentFolder, folder } = req.body

        if (!parentFolder || !folder) {
            return res.status(400).json({
                message: "Provide required credentials"
            })
        }

        const publicImages = await imageModel.find(
            { parentFolder: parentFolder, folder: folder, visibility: "Public" }
        )

        if (publicImages.length === 0) {
            return res.status(200).json({
                message: "No images present"
            })
        }

        const imagesData = await publicImages.flatMap(ele => (ele.images))
        return res.status(200).json({
            message: "Data fetched successfully",
            data: publicImages,
            images: imagesData
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}