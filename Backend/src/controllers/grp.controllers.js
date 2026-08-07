import groupModel from "../models/group.model.js";
import userModel from '../models/user.model.js'
import inviteModel from '../models/addMember.model.js'
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

        const group = await groupModel.findById(groupId)
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
        const { groupId } = req.body

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