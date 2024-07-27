const express = require("express")
const router = express.Router()

const {
    getUsers,
    getUserById,
} = require("../controllers/user-controller")

router.get('/users', getUsers)
router.get('/user/:id', getUserById)

module.exports = router