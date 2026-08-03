import * as imageKit from "../services/image.service.js"
import imageModel from "../models/image.model.js"


export async function uploadImages(req, res) {
    try {
        const files = req.files
        const user = req.user
        if (!files) {
            return res.status(400).json({
                message: "file not found"
            })
        }
        
        const result = await Promise.all(
            files.map(ele=>(imageKit.uploadFile(ele)))
        )

        console.log(result);
        const myImages = result.map(ele=>({url:ele.url,fileId:ele.fileId,name:ele.name}))
        console.log(myImages);

        const images = await imageModel.create({
            user : user._id,
            images : myImages,
            folder : "My Notes"
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
