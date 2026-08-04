import imageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const imagekit01 = new imageKit({
    publicKey : config.publicKey,
    privateKey : config.privateKey,
});

export async function uploadFile(file) {
    const result = await imagekit01.files.upload({
        file: file.buffer.toString("base64"),
        fileName : file.originalname,
        folder : "/app-images"
    });

    return result;
}

export async function deleteFile(fileIds) {
    console.log(fileIds);
    console.log(Array.isArray(fileIds));

    return await imagekit01.files.bulk.delete({
        fileIds,
    });
}