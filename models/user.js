const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bcrypt = require('bcryptjs');
const pick = require("lodash.pick")

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String
        // type: Object
    }
}, { timestamps: true })

userSchema.methods.comparePassword = async (currentPassword, hashPassword) => {
    return await bcrypt.compare(currentPassword, hashPassword);
}

userSchema.methods.getUserInfo = (data) => {
    return pick(data, ["_id", "first_name", "last_name", "full_name", "email", "role", "avatar"]);
};

userSchema.methods.checkTest = () => {
    console.log('checkTest')
};

const User = mongoose.model('User', userSchema)
module.exports = User