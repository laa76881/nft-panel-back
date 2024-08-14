const User = require("../models/user")
// const Token = require("../models/token")
const bcrypt = require('bcryptjs');
const fs = require('fs')

const {
    handleError,
    handleResponse
} = require("../utils/serverMessages")

const saveProfile = async (req, res) => {
    const { first_name, last_name } = req.body
    const user = await User.findById(req.app.locals.user_id)
    if (!user) return res.status(500).send('Error found user')
    user.first_name = first_name
    user.last_name = last_name
    await user.save()
    handleResponse(res, 'Profile has been updated!', user)
}

const updatePassword = async (req, res) => {
    const { current_password, password, password_confirmation } = req.body
    const user = await User.findById(req.app.locals.user_id)
    if (!user) return res.status(500).send('Error found user')
    const isMatched = await user.comparePassword(current_password, user.password);
    if (!isMatched) return handleError(res, 'Invalid password!', 400)
    if (password !== password_confirmation) return handleError(res, 'Passwords not match!', 400)
    const newPassword = await bcrypt.hash(password, 10)
    user.password = newPassword
    await user.save()
    handleResponse(res, 'Your password has been updated!')
}

const updateAvatar = async (req, res) => {
    const user = await User.findById(req.app.locals.user_id)
    if (req.file) {
        const path = `http://${req.headers.host}/${req.file.path.split("public/")[1]}`
        user.avatar = path
        await user.save()
        res.status(200).json({
            path
        })
    } else {
        const filePath = user.avatar.replace(`http://${req.headers.host}`, './public')
        fs.unlink(filePath, async (err) => {
            if (err) return handleError(res, 'No such file or directory!', 500)
            user.avatar = null
            await user.save()
            handleResponse(res, 'Your avatar has been removed!')
        })
    }
}

module.exports = {
    saveProfile,
    updatePassword,
    updateAvatar,
}