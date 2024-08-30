const express = require("express")
const router = express.Router()

const {
    getChats,
    getChatById,
    initChat,
    getMessages,
    sendMessage
} = require("../controllers/chats-controller")

router.get('/', getChats)
router.get('/:id', getChatById)
router.post('/init', initChat)
router.get('/:id/messages', getMessages)
router.post('/:id/messages', sendMessage)
module.exports = router