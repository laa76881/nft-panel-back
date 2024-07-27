const express = require("express")
const router = express.Router()

const {
    verifyEmail
} = require("../controllers/redirect-controller")

router.get('/verify-email/:id/:token', verifyEmail)

module.exports = router