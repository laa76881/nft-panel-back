const User = require("../models/user")
const {
    handleError
} = require("../utils/serverMessages")

const getUsers = ((req, res) => {
    User
        .find()
        .sort({ createdAt: -1 })
        .then((users) => {
            res.status(200).json(users)
        })
        .catch((error) => handleError(res, error))
})

const getUserById = ((req, res) => {
    User
        .findById(req.params.id)
        .then((user) => res.status(200).json(user))
        .catch((error) => handleError(res, error))
})

module.exports = {
    getUsers,
    getUserById
}