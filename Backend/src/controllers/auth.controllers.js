import bcrypt from "bcrypt"
import userModel from "../models/user.model.js"

export async function register(req, res) {

    try {
        const { username, email, password, confirmPassword, role = "user" } = req.body

        if(!(password===confirmPassword)){
            return res.status(409).json({
                message : "Password and confirm password are different"
            })
        }

        const isValidUser = await userModel.findOne({
            $or:[{username:username},{email:email}]
        })
        if(isValidUser){
            return res.status(409).json({
                message : "User already registered in database"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        return res.status(201).json({
            message: 'User registered successfully',
            User: user
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            messsage: err.message
        })
    }

}

export async function login(req, res) {
    try {
        const { usernameOrEmail, password } = req.body

        const user = await userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }).select("+password")
        console.log({"username" : usernameOrEmail});
        console.log({"email" : usernameOrEmail});
        console.log({"usernameOrEmail" : usernameOrEmail});

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        console.log({"validPassword" : isValidPassword});

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const { password: _, ...userWithoutPassword } = user.toObject()

        return res.status(200).json({
            message: 'User logged in successfully',
            User: userWithoutPassword
        })
    }
    catch (err) {
        return res.status(500).json({
            error: "Server Error",
            message: err.message
        })
    }
}