const express = require('express');
// const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
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
app.use(methodOverride('_method'))
app.use(cors());

const handleError = ((res, error, status) => {
    console.log(error)
    res.status(status ? status : 500).send(error)
})

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
                    res.status(401).send('Token expired!')
                    next('Token expired!')
                } else {
                    if (req.url === '/api/auth/me') {
                        const user = await User.findById(payload.id)
                        if (!user) return handleError(res, 'Error found user')
                        res.status(200).json(user)
                    } else {
                        next()
                    }
                }
            }
        );
    } else {
        res.status(401).send('Token expired!')
        next('Token expired!')
    }
});

const authRoutes = require('./routes/auth-route')
const userRoutes = require('./routes/user-route')
const redirectRoutes = require('./routes/redirect-route')

mongoose
    .connect(db)
    .then(() => console.log('Connected'))
    .catch((error) => console.log(error))

app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)
app.use("/api/redirects", redirectRoutes)

app.listen(PORT, (error) => {
    error ? error : console.log(`listening port ${PORT}`)
})

