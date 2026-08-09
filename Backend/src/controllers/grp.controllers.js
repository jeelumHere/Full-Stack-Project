import groupModel from "../models/group.model.js";
import userModel from '../models/user.model.js'
import inviteModel from '../models/addMember.model.js'
import grpImageModel from "../models/grp.Images.model.js"
import * as imageKit from "../services/image.service.js"

export async function createGroup(req, res) {
    try {
        const user = req.user
        const { name } = req.body
        if (!name) {
            return res.status(400).json({
                message: "Name the Group"
            })
        }

        const members = [{ user: user._id, role: "admin" }]
        const group = await groupModel.create({
            name: name,
            admin: user._id,
            members: members,
            totalMembers: 1
        })

        res.status(201).json({
            message: "Group created",
            group: group
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function addMember(req, res) {
    try {
        const user = req.user
        const { usernameOrEmail } = req.body
        const groupId = req.params.groupId

        const newUser = await userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        })

        if (!newUser) {
            return res.status(404).json({
                message: "No user is found with this email or username"
            })
        }

        if (newUser._id.toString() === user._id.toString()) {
            return res.status(409).json({
                message: "You cannot invite yourself"
            })
        }

        const group = await groupModel.findOne({ _id: groupId, 'members.user': user._id })
        if (!group) {
            return res.status(404).json({ message: "Group does not exist" })
        }

        const alreadyMember = group.members.some(m => m.user.toString() === newUser._id.toString())
        if (alreadyMember) {
            return res.status(409).json({
                message: `${newUser.username} is already a member of this group`
            })
        }

        const invitation = await inviteModel.findOneAndUpdate(
            { sender: user._id, receiver: newUser._id, group: group._id },
            { expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) },
            { upsert: true, returnDocument: "after" }
        )

        return res.status(200).json({
            message: `Invitation sent to ${newUser.username}`
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function invitation(req, res) {
    try {
        const user = req.user

        const myInvitation = await inviteModel
            .findOne({ receiver: user._id })
            .populate("sender", "username")
            .populate("group", "name")

        if (!myInvitation) {
            return res.status(404).json({
                message: "Invitation not found or has expired"
            })
        }

        return res.status(200).json({
            message: `You are invited to join group`,
            group: myInvitation.group.name,
            groupId: myInvitation.group._id,
            invitedBy: myInvitation.sender.username
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function acceptInvitation(req, res) {
    try {
        const user = req.user
        const groupId = req.body.groupId

        const isValidInvite = await inviteModel.findOne({ receiver: user._id, group: groupId })
        if (!isValidInvite) {
            return res.status(401).json({ message: "Not a valid invite" })
        }
        if (!groupId) {
            return res.status(400).json({ message: "Provide required credentials" })
        }

        const group = await groupModel.findById(groupId)
        if (!group) {
            return res.status(400).json({ message: "Group does not exist anymore" })
        }

        console.log(group.totalMemebers);
        const alreadyMember = group.members.some(m => m.user.toString() === user._id.toString())
        if (alreadyMember) {
            return res.status(400).json({ message: "Already a member of this group" })
        }

        await groupModel.findByIdAndUpdate(groupId, {
            $addToSet: { members: { user: user._id, role: "member", joinedAt: new Date() } },
            $inc: { totalMembers: 1 }
        })

        await inviteModel.findOneAndDelete({ receiver: user._id, group: groupId })

        return res.status(200).json({ message: "Joined group successfully" })
    }
    catch (err) {
        return res.status(500).json({
            error: 'Server Error',
            message: err.message
        })
    }
}

export async function myGroups(req, res) {
    try {
        const user = req.user

        const groups = await groupModel.find({
            "members.user": user._id
        });

        return res.status(200).json({
            message: "Data fetched successfully",
            groups: groups
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}

export async function uploadImages(req, res) {
    try {
        const files = req.files;
        const user = req.user;
        const { parentFolder, folder } = req.body;
        const groupId = req.params.groupId;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "File not found" });
        }

        if (!parentFolder || !folder) {
            return res.status(400).json({ message: "parentFolder and folder are required" });
        }

        // 1. Single DB hit: verify group exists AND user is a member
        const validGroup = await groupModel.findOne({
            _id: groupId,
            'members.user': user._id
        });

        if (!validGroup) {
            return res.status(403).json({
                message: "Group not found or you are not an authorized member"
            });
        }

        // 2. Parallel upload — don't let one failure kill the whole batch
        const uploadResults = await Promise.allSettled(
            files.map(file => imageKit.uploadFile(file, user))
        );

        const succeeded = uploadResults
            .filter(r => r.status === "fulfilled")
            .map(r => r.value);

        const failed = uploadResults.filter(r => r.status === "rejected");

        if (succeeded.length === 0) {
            return res.status(502).json({ message: "All uploads failed" });
        }

        // 3. Map into schema format
        const newImages = succeeded.map(result => ({
            user: user._id,
            url: result.url,
            fileId: result.fileId,
            name: result.name
        }));

        // 4. Atomic push — no race condition, no read-modify-write
        const updatedData = await grpImageModel.findOneAndUpdate(
            { group: validGroup._id, parentFolder, folder },
            { $push: { images: { $each: newImages } } },
            { upsert: true, returnDocument: "after" }
        );

        return res.status(201).json({
            message: failed.length > 0
                ? `Uploaded ${succeeded.length} of ${files.length} files; ${failed.length} failed`
                : "Files uploaded successfully",
            data: updatedData
        });

    } catch (err) {
        console.error("uploadImages error:", err);
        return res.status(500).json({
            error: "Server Error",
            message: "Something went wrong while uploading files"
        });
    }
}

export async function deleteImages(req, res) {
    try {
        const user = req.user;
        const { folder, parentFolder } = req.body;
        const { groupId } = req.params;

        if (!parentFolder || !folder) {
            return res.status(400).json({ message: "parentFolder and folder are required" });
        }

        let fileIds;
        try {
            fileIds = JSON.parse(req.body.fileIds);
        } catch {
            return res.status(400).json({ message: "Invalid fileIds format" });
        }

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            return res.status(400).json({ message: "fileIds must be a non-empty array" });
        }

        // 1. Verify group exists AND user is a member
        const validGroup = await groupModel.findOne({
            _id: groupId,
            'members.user': user._id
        });

        if (!validGroup) {
            return res.status(403).json({
                message: "Group not found or you are not an authorized member"
            });
        }
        const groupDoc = await grpImageModel.findOne(
            { group: validGroup._id, parentFolder, folder },
            { images: 1 } // only fetch the images field
        );

        if (!groupDoc) {
            return res.status(403).json({
                message: "Group not found or you are not an authorized member"
            });
        }

        const matchedFileIds = groupDoc.images
            .filter(img => fileIds.includes(img.fileId) && String(img.user) === String(user._id))
            .map(img => img.fileId);

        console.log(matchedFileIds);
        // 2. Delete from ImageKit first — don't leave DB/storage out of sync if this fails
        await imageKit.deleteFile(matchedFileIds);

        // 3. Atomic pull — no race condition, no read-modify-write
        const newImageData = await grpImageModel.findOneAndUpdate(
            { group: validGroup._id, parentFolder, folder },
            { $pull: { images: { fileId: { $in: fileIds }, user: user._id } } },// only pull images that ALSO belong to this user
            { returnDocument: 'after' }
        );

        if (!newImageData) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // 4. Clean up the folder doc if it's now empty
        if (newImageData.images.length === 0) {
            await grpImageModel.deleteOne({ _id: newImageData._id });
        }

        return res.status(200).json({
            message: "Files deleted successfully"
        });

    } catch (err) {
        console.error("deleteImages error:", err);
        return res.status(500).json({
            error: "Server Error",
            message: "Something went wrong while deleting files"
        });
    }
}

export async function leaveGroup(req, res) {
    try {
        const user = req.user;
        const groupId = req.params.groupId;

        const updatedGroup = await groupModel.findOneAndUpdate(
            { _id: groupId, 'members.user': user._id },
            { $pull: { members: { user: user._id } } },
            { returnDocument: 'after' }
        );

        if (!updatedGroup) {
            return res.status(403).json({
                message: "Group not found or you are not an authorized member"
            });
        }

        if (updatedGroup.members.length === 0) {
            const groupData = await grpImageModel.find({ group: groupId });

            const fileIds = groupData.flatMap(ele => ele.images.map(e => e.fileId));

            if (fileIds.length > 0) {
                await imageKit.deleteFile(fileIds);
            }

            await grpImageModel.deleteMany({ group: groupId });
            await groupModel.findByIdAndDelete(groupId);
        }

        return res.status(200).json({
            message: `You left the group ${updatedGroup.name}`
        });
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        });
    }
}

export async function removeMember(req, res) {

    try {
        const user = req.user
        const memberId = req.params.memberId;
        const groupId = req.params.groupId

        if(user._id==memberId){
            return res.status(401).json({
                message : "You cannot remove yourself"
            })
        }

        const updatedGroup = await groupModel.findOneAndUpdate(
            { _id: groupId, 'members.user': user._id },
            { $pull: { members: { user: memberId } } },
            { returnDocument: 'after' }
        );

        if (!updatedGroup) {
            return res.status(403).json({
                message: "Group not found or you are not an authorized member"
            });
        }
        if (updatedGroup.admin !== user._id) {
            return res.status(403).json({
                message: "You are not authorized to remove any member"
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            error: 'Server Error',
            message: err.message
        })
    }

}