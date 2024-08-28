const Chat = require("../models/chat")

const handleSocketConnection = ((io, socket, user_id) => {
    // const token = socket.handshake.auth.token
    // console.log('token', token)
    // jwt.verify(
    //     token,
    //     process.env.JWT_SECRET,
    //     async (err, payload) => {
    //         if (err) {
    //             console.log('expired')
    //         } else {
    //            console.log('done', payload)
    //         }
    //     }
    // );

    console.log(`User ${socket.id} connected`)

    // Upon connection - only to user !!!
    // socket.emit('message', "Welcome to Chat App!") 

    // Upon connection - to all others 
    socket.broadcast.emit('connected', `User ${socket.id.substring(0, 5)}} connected`)

    // Listening for a message event 
    socket.on('message', data => {
        console.log('on message', data)
        io.emit('message', data)
    })

    // When user disconnects - to all others 
    socket.on('disconnect', () => {
        console.log('disconnect')
        socket.broadcast.emit('disconnected', `User ${socket.id.substring(0, 5)}} disconnected`)
    })

    // Listen for activity 
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
})

module.exports = {
    handleSocketConnection
}