const User = require("../models/user")
const Token = require("../models/token")

const handleError = ((res, error, status) => {
    console.log(error)
    res.status(status ? status : 500).send(error)
})

const verifyEmail = ((req, res) => {
    Token
        .findOne({ token: req.params.token }) // user_id
        .then(() => {
            User
                .findById(req.params.id)
                .then((user) => {
                    console.log('user', user)
                    if (user.is_verified) return redirectUserPage(req, res, 'expired')
                    user.is_verified = true
                    user.save()
                        .then(() => redirectUserPage(req, res, 'email-confirmed'))
                        .catch((error) => handleError(res, error))
                })
                .catch((error) => {
                    handleError(res, error)
                })
        })
        .catch((error) => {
            console.log('Your token can be expired', error)
            redirectUserPage(req, res, 'expired')
        })
})

const redirectUserPage = ((req, res, route) => {
    return res.redirect(`${process.env.DOMAIN_NAME}/${route}`)
})

module.exports = {
    verifyEmail
}