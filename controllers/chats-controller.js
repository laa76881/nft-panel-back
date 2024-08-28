const Chat = require("../models/chat")
const User = require("../models/user")
const Message = require("../models/message")

const {
    handleError
} = require("../utils/serverMessages")

const getChats = (async (req, res) => {
    console.log('req params', req.query)
    const user_id = req.app.locals.user_id
    // const page = parseInt(req.query.page) || 1;
    // const per_page = parseInt(req.query.per_page) || 10;
    // const search = req.query.search || ''
    const sorting = { [req.query.sort_field || 'createdAt']: +req.query.sort_direction || -1 }
    // const startIndex = (page - 1) * per_page;
    const searchOptions = {
        $or: [
            { to_id: { $regex: user_id } },
            { from_id: { $regex: user_id } },
        ]
    }
    // if (search)
    //     searchOptions.$or = [
    //         { full_name: { $regex: search, $options: 'i' } },
    //         { email: { $regex: search, $options: 'i' } },
    //     ]

    const total = await Chat.countDocuments(searchOptions);

    Chat
        .find(searchOptions)
        // .skip(startIndex)
        // .limit(per_page)
        .sort(sorting)
        .then(async (chats) => {
            const data = await filterChats(user_id, chats)
            res.status(200).json({
                total,
                data
            })
        })
        .catch((error) => handleError(res, error))
})

const filterChats = async (user_id, data) => {
    let newChats = []
    for (const chat of data) {
        const from_id = chat.to_id === user_id ? chat.from_id : chat.to_id
        const from = await User.findById(from_id)
        newChats.push({
            _id: chat._id,
            type: chat.type,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            // from_id,
            // to_id: user_id,
            from: from.getUserInfo(from)
        })
    }
    return newChats
}

const getChatById = ((req, res) => {
    Chat
        .findById(req.params.id)
        .then(async (chat) => {
            if (!chat) return handleError(res, 'Chat not found!')
            const user_id = req.app.locals.user_id
            if (chat.to_id !== user_id && chat.from_id !== user_id) return handleError(res, 'Chat not found!')
            const chats = await filterChats(user_id, [chat])
            const activeChat = chats[0]
            console.log('activeChat', activeChat)
            res.status(200).json(activeChat)
        })
        .catch((error) => handleError(res, error))
})

const initChat = (async (req, res) => {
    const { to_id } = req.body
    const from_id = req.app.locals.user_id

    const searchOptions = {
        $or: [
            {
                $and: [
                    { to_id: { $regex: to_id } },
                    { from_id: { $regex: from_id } },
                ]
            },
            {
                $and: [
                    { to_id: { $regex: from_id } },
                    { from_id: { $regex: to_id } },
                ]
            }
        ]
    }

    const chatExist = await Chat.find(searchOptions)
    console.log('check chats', chatExist)
    if (chatExist[0]) return res.status(200).json(chatExist[0])
    const chat = await Chat.create({
        to_id,
        from_id
    })
    console.log('created', chat)
    res.status(200).json(chat)
})

const sendMessage = (async (req, res) => {
    const { message } = req.body
    console.log('message', message)
    console.log('params', req.params)
    const from_id = req.app.locals.user_id

    // const chatExist = await Chat.find(searchOptions)
    // console.log('check chats', chatExist)
    // if (chatExist[0]) return res.status(200).json(chatExist[0])
    const newMessage = await Message.create({
        message,
        chat_id: req.params.id,
        from_id
    })
    console.log('created message', newMessage)
    res.status(200).json(newMessage)
})

module.exports = {
    getChats,
    getChatById,
    initChat,
    sendMessage
}