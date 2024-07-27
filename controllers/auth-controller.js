const User = require("../models/user")
const Token = require("../models/token")

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require("crypto");

const handleError = ((res, error, status) => {
    console.log(error)
    res.status(status ? status : 500).send(error)
})

const signUp = async (req, res) => {
    const { last_name, first_name, email, password, password_confirmation } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) return handleError(res, 'This email already exist!', 400)

    if (password !== password_confirmation) return handleError(res, 'Passwords not match!', 400)
    const newPassword = await bcrypt.hash(password, 10)

    try {
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: newPassword,
            role: 0 // user
        })
        await sendEmail(req, res, user)
        res.status(200).json(
            {
                success: true,
                message: `You have successfully registered. A verification email was sent to ${email}`,
            }
        )
    } catch (error) {
        console.log('error create ', error)
        handleError(res, 'Something wrong!')
    }
}

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return handleError(res, 'Email and password are required!', 400)

        // find user by email
        const user = await User.findOne({ email });
        if (!user) return handleError(res, 'Email is not exist!', 400)
        console.log('user', user)
        // check password
        const isMatched = await comparePassword(password, user.password);
        if (!isMatched) return handleError(res, 'Invalid credentials', 400)

        if (!user.is_verified)
            return handleError(res, 'Your account has not verified! Please confirm your email!', 400)

        const token = await generateToken(user, res);
        console.log('get info', token)
    }
    catch (error) {
        console.log(error);
        handleError(res, 'Cannot log in, check your credentials', 400)
    }
}

const generateToken = async (user, res) => {
    // const token = await user.jwtGenerateToken();
    // const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    //     expiresIn: 3600
    // });
    const EXPIRE_TOKEN = 1 * 60 * 60 * 1000 // 1 hour
    // const JWT_SECRET = '3v2h-9s3v-e77p-eb5k'
    const id = user.id
    console.log('id', id)
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3600 // ? why
    });
    console.log('token', token)

    // let myid = '668d320e84d37b0286f94e8c'
    // expired 2024-07-18T16:29:27.208Z - after 1h

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + EXPIRE_TOKEN) // process.env.EXPIRE_TOKEN
    };
    console.log('options', options)

    res
        .status(200)
        .cookie('token', token, options)
        .json({ success: true, token })

    return token
}

const comparePassword = async (currentPassword, hashPassword) => {
    return await bcrypt.compare(currentPassword, hashPassword);
}

const resendVerification = async (req, res) => {
    // check and delete old token ??
    const { email } = req.body
    if (!email) console.log('No user email')
    const user = await User.findOne({ email })
    if (user.is_verified) return handleError(res, 'You already verified!')
    await sendEmail(req, res, user)
    res.status(200).json(
        {
            success: true,
            message: `A verification email was resent to ${email}`,
        }
    )
}

const sendEmail = async (req, res, user) => { // verifyToken
    // let EXPIRE_TOKEN = 1 * 60 * 60 * 1000
    const verifyToken = await Token.create({
        user_id: user._id,
        token: crypto.randomBytes(16).toString("hex"),
        // expire_at: new Date(Date.now() + EXPIRE_TOKEN)
    });
    console.log('verifyToken', verifyToken)

    // let email = user.email
    let email = 'laa76881@gmail.com' // email for tests
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_TRANSPORTER_USER,
            pass: process.env.MAIL_TRANSPORTER_PASS,
        },
    });

    let link = `http://${req.headers.host}/api/redirects/verify-email/${user._id}/${verifyToken.token}`

    const result = await transporter.sendMail({
        from: 'support@test.com',
        to: email,
        subject: 'Confirm your email',
        html:
            `<h3>Dear user!</h3><p>Your new account was created.Please confirm your data via link:</p><a href="${link}" target="_blank">${link}</a>`,
        // attachments: [
        //     {
        //         filename: 'greetings.txt',
        //         content: "Message from file."
        //     },
        // ]
    });
}

module.exports = {
    logIn,
    signUp,
    resendVerification
}