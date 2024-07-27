const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    // expireAt: {
    //     type: Date,
    //     default: Date.now,
    //     index: { expires: 86400000 } // 24h
    // },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        references: { model: "users", key: "_id" }
    },
}, { timestamps: true })

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token