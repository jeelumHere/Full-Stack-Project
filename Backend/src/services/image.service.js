import imageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const imagekit01 = new imageKit({
    publicKey : config.publicKey,
    privateKey : config.privateKey,
});

export async function uploadFile(file,user) {
    const result = await imagekit01.files.upload({
        file: file.buffer.toString("base64"),
        fileName : file.originalname,
        folder : `/app-images/${user.username}`,
        useUniqueFileName: true
    });

    return result;
}

export async function deleteFile(fileIds) {
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
        return { successfullyDeletedFileIds: [], errors: [] };
    }

    return await imagekit01.files.bulk.delete({ fileIds });
}