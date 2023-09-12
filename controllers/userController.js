import User from "../models/User.js"
import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/generateJWT.js"
import {emailRegistration, emailForgotPassword} from "../helpers/emails.js"
import user from "../models/User.js"

const toRegister = async (req, res) => {

    const { email } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('User already registered')
        return res.status(400).json({ msg: error.message })
    }
    try {
        const user = new User(req.body)
        user.token = generateId()
        await user.save()
        emailRegistration({
            email: user.email,
            name: user.name,
            token: user.token
        })
        res.json({ msg: "User created correctly, check your email to confirm your account" })
    } catch (error) {
        console.log(error)
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error("Username does not exist")
        return res.status(404).json({ msg: error.message })
    }
    if (!user.confirm) {
        const error = new Error("Your account has not been confirmed")
        return res.status(403).json({ msg: error.message })
    }
    if (await user.checkPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        })
    } else {
        const error = new Error("Incorrect password")
        return res.status(403).json({ msg: error.message })
    }
}

const confirmUser = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ token });
    if (!user) {
        const error = new Error("Invalid token");
        return res.status(404).json({ msg: error.message });
    }
    try {
        user.confirm = true;
        user.token = "";
        await user.save();
        return res.json({ msg: "User Confirmed Correctly" });
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Invalid token" });
    }
};


const lostPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error("Username does not exist")
        return res.status(404).json({ msg: error.message })
    }
    try {
        user.token = generateId()
        await user.save()
        emailForgotPassword({
            email: user.email,
            name: user.name,
            token: user.token
        })
        return res.status(200).json({ msg: "We have sent an email with the instructions" });
    } catch (error) {
        console.log(error)
    }
}

const checkToken = async (req, res) => {
    const { token } = req.params
    const valideToken = await User.findOne({ token })
    if (valideToken) {
        res.json({ msg: "Valid token and user exists" })
    } else {
        const error = new Error("Invalid token")
        return res.status(404).json({ msg: error.message })
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body
    const user = await User.findOne({ token })
    if (user) {
        user.password = password
        user.token = ""
        try {
            await user.save()
            res.json({ msg: "Password changed successfully" })
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error("Invalid token")
        return res.status(404).json({ msg: error.message })
    }
}

const profile = async (req, res) => {
    const { user } = req
    res.json(user)
}

export { toRegister, authenticate, confirmUser, lostPassword, checkToken, newPassword, profile }