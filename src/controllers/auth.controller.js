const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {

    const { username, email, password, role = 'user' } = req.body;

    try {

        const isUserExits = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isUserExits) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        })

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        )

        res.cookie('token', token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        })

    } catch (error) {
        console.log("User Register Error", error)

        res.status(500).json({
            message: "Server Error"
        })
    }
}

async function loginUser(req, res){
    const { username , email, password}= req.body;
    try {
        const user= await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })

        if(!user){
            return res.status(401).json({
                message:"Invalid Credentials"
            })
        }
        const isPasswordValid=await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
             return res.status(401).json({
                message:"Invalid Credentials"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        )

        res.cookie("token", token)

        
        res.status(200).json({
            message: "User login successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        })


    } catch (error) {
        console.log("user login error ", error)
        res.status(500).json({
            message:"server error"
        })
    }
}
async function logoutUser(req, res){
    res.clearCookie("token")

    res.status(200).json({
        message:"User logout successfully"
    })
}

module.exports = { registerUser, loginUser, logoutUser }