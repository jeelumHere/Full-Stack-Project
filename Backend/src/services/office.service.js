import config from "../config/config.js"


import { PutObjectCommand, S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
    endpoint: config.b2Endpoint,
    region: 'eu-central-003', // match your bucket's region
    credentials: {
        accessKeyId: config.b2KeyId,
        secretAccessKey: config.b2ApplicationKey,
    },
    forcePathStyle: true, // required for B2
});


export async function uploadToB2(file,user) {
    const key = `${user.username}/${Date.now()}-${file.originalname}`;;

    const command = new PutObjectCommand({
        Bucket: config.b2BucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return key;
}

export async function getFileUrl(key) {
  const command = new GetObjectCommand({
    Bucket: config.b2BucketName,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour
  return url
}

  
// export async function deleteFromB2(keys) {
//   // keys = array of strings, e.g. ["169999-file1.docx", "170000-file2.pptx"]
//   if (!keys || keys.length === 0) return;

//   const command = new DeleteObjectsCommand({
//     Bucket: config.b2BucketName,
//     Delete: {
//       Objects: keys.map((key) => ({ Key: key })),
//     },
//   });

//   const result = await s3Client.send(command);
//   return result;
// }


import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteFromB2(keys) {
  if (!keys || keys.length === 0) return [];

  const deletePromises = keys.map(async (key) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.b2BucketName,
        Key: key,
      });

      const response = await s3Client.send(command);
      return { key, success: true, response };
    } catch (error) {
      console.error(`Failed to delete key: ${key}`, error);
      return { key, success: false, error: error.message };
    }
  });

  // Executes everything simultaneously
  const results = await Promise.all(deletePromises);
  return results;
}
