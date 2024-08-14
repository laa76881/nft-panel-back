const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
// const methodOverride = require('method-override')
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');

const User = require("./models/user")

require('dotenv').config()

const PORT = process.env.PORT
const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`

const app = express();
app.use(bodyParser.json()); // application/json - body
// app.use(express.urlencoded({ extended: false })); // forms body
app.use(express.static('public'))
app.use(cors());

//token verify
app.use((req, res, next) => {
    if ((req.url.includes('/api/auth/') && req.url !== '/api/auth/me') || req.url.includes('/api/redirects/')) {
        next()
    } else if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET,
            async (err, payload) => {
                if (err) {
                    app.locals.user_id = null
                    res.status(401).send('Token expired!')
                    next('Token expired!')
                } else {
                    app.locals.user_id = payload.id;
                    if (req.url === '/api/auth/me') {
                        const user = await User.findById(app.locals.user_id)
                        if (!user) return res.status(500).send('Error found user')
                        res.json(user.getUserInfo(user))
                    } else {
                        next()
                    }
                }
            }
        );
    } else {
        app.locals.user_id = null
        res.status(401).send('Token expired!')
        next('Token expired!')
    }
});

const authRoutes = require('./routes/auth-route')
const userRoutes = require('./routes/user-route')
const redirectRoutes = require('./routes/redirect-route')
const profileRoutes = require('./routes/profile-route')

mongoose
    .connect(db)
    .then(() => console.log('Connected'))
    .catch((error) => console.log(error))

app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)
app.use("/api/redirects", redirectRoutes)
app.use("/api/profile", profileRoutes)

app.listen(PORT, (error) => {
    error ? error : console.log(`listening port ${PORT}`)
})