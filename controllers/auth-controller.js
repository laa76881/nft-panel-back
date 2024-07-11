const User = require("../models/user")

const handleError = ((res, error, status) => {
    console.log(error)
    res.status(status ? status : 500).send(error)
})

// const logIn = async (req, res) => {    
    // try {
    //     const { email, password } = req.body;
    //     if (!email || !password) return handleError(res, 'Email and password are required!', 400)

    //     // check user e-mail
    //     const user = await User.findOne({ email });
    //     if (!user) return handleError(res, 'Invalid credentials', 400)

    //     // // verify user password
    //     // const isMatched = await User.comparePassword(password);
    //     // if (!isMatched) return handleError(res, 'Invalid credentials', 400)

    //     res.status(200).json(user)
    //     console.log('trueee')

    //     // generateToken(user, 200, res);
    // }
    // catch (error) {
    //     console.log(error);
    //     handleError(res, 'Cannot log in, check your credentials', 400)
    // }
// }

const logIn = async (req, res) => {
    console.log('req', req.query, req.body)
    if (!req.body) return handleError(res, 'No body', 390)
    const { email } = req.body;
    if (!email) return handleError(res, 'Email is required!', 310)
    // if (!email || !password) return handleError(res, 'Email and password are required!')

    User
        .findOne({ email })
        .then((user) => res.status(200).json(user))
        .catch((error) => handleError(res, error.message, 406))
}

module.exports = {
    logIn
}