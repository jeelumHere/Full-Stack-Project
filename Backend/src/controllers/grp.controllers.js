import groupModel from "../models/group.model.js";
import userModel from '../models/user.model.js'
import inviteMember from '../models/addMember.model.js'
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
        const user = req.user;
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

        if (newUser.username == user.username) {
            return res.status(409).json({
                message: "You are already in the group"
            })
        }
        const group = await groupModel.findById(groupId)

        const invitation = await inviteMember.findOneAndUpdate(
            { sender: user._id, receiver: newUser._id, group: group._id },
            { groupName: group.name, expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) },  // 48 hours
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