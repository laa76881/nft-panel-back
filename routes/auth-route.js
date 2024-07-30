const express = require("express")
const router = express.Router()

const {
    logIn,
    signUp,
    resendVerification,
    resetPassword,
    getMe
} = require("../controllers/auth-controller")

router.post('/login', logIn)
router.post('/sign-up', signUp)
router.post('/resend-verification', resendVerification)
router.post('/reset-password', resetPassword)
router.get('/me', getMe)

module.exports = router