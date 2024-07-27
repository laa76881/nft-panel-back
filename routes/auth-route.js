const express = require("express")
const router = express.Router()

const {
    logIn,
    signUp,
    resendVerification
} = require("../controllers/auth-controller")

router.post('/login', logIn)
router.post('/sign-up', signUp)
router.post('/resend-verification', resendVerification)

module.exports = router