import { Router } from 'express'
import upload from "../middleware/file.middleware.js"
import * as authMiddleware from "../middleware/auth.middleware.js"

const fileRouter = Router()

fileRouter.post("/", authMiddleware.validateUserAccessToken,upload.single("file"))
fileRouter.delete("/", authMiddleware.validateUserAccessToken)


fileRouter.delete("/", async (req, res) => {

    try {
        const cloudResult = await fileService.deletePdf('My Pdfs/1786459018126-daniel_hashmi_resume.pdf');
        if (cloudResult.result !== 'ok') {
            return res.status(500).json({ message: 'Failed to delete from Cloudinary', cloudResult });
        }

        return res.json({ message: 'PDF deleted' });
    }
    catch(err){
        return res.send({message : "Server Error", error:err.message})
    }
})
export default fileRouter