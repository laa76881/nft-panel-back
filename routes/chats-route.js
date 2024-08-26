const express = require("express")
const router = express.Router()

const {
    getChats,
    getChatById,
    initChat
} = require("../controllers/chats-controller")

router.get('/', getChats)
router.get('/:id', getChatById)
router.post('/init', initChat)

module.exports = router