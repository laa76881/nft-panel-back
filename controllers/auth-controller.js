const User = require("../models/user")

// const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const handleError = ((res, error, status) => {
    console.log(error)
    res.status(status ? status : 500).send(error)
})

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return handleError(res, 'Email and password are required!', 400)

        // find user by email
        const user = await User.findOne({ email });
        if (!user) return handleError(res, 'Invalid credentials', 400)

        // verify user password
        // const isMatched = await user.comparePassword(password);
        const isMatched = user.password === password ? true : false
        console.log('isMatched', isMatched)
        if (!isMatched) return handleError(res, 'Invalid credentials', 400)

        // ¸.status(200).json(user)

        generateToken(user, res);
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
    const EXPIRE_TOKEN = 1*60*60*1000
    const JWT_SECRET = '3v2h-9s3v-e77p-eb5k'
    const id = user.id
    const token = jwt.sign({ id }, JWT_SECRET, {
        expiresIn: 3600
    });
    console.log('token', token)

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + EXPIRE_TOKEN) // process.env.EXPIRE_TOKEN
    };
    console.log('options', options)

    res
        .status(200)
        .cookie('token', token, options)
        .json({ success: true, token })
}

module.exports = {
    logIn
}