import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import config from "../config/config.js"
import userModel from '../models/user.model.js'
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
})

export const uploadFile = (buffer, filename, folder = user) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'raw', public_id: Date.now() + '-' + filename },
            (err, result) => err ? reject(err) : resolve(result)
        )
        streamifier.createReadStream(buffer).pipe(stream)
    })
}

export const deletePdfs = async (publicIds) => {
    return cloudinary.uploader.delete_resources(publicIds, { resource_type: 'raw' });
};