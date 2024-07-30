const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');

require('dotenv').config()

const PORT = process.env.PORT
const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`

const app = express();
app.use(bodyParser.json()); // application/json - body
// app.use(express.urlencoded({ extended: false })); // forms body
app.use(methodOverride('_method'))
app.use(cors());

const routesWithoutAuth = ['login', 'sign-up', 'resend-verification', 'me']

//token verify
app.use((req, res, next) => {
    // console.log('request', req.url, routesWithoutAuth.includes(req.url.replace('/api/auth/', '')))
    console.log('check url match ', req.url.includes(('/api/auth/')), req.url.includes('/api/redirects/'))
    console.log('app token ', req.headers.authorization)

    // if (routesWithoutAuth.includes(req.url.replace('/api/auth/', '')) || req.url.includes('/api/redirects')) {
    if (req.url.includes(('/api/auth/')) || req.url.includes('/api/redirects/')) {
        next()
    } else if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET,
            (err, payload) => {
                if (err) {
                    console.log('token err', err)
                    res.status(401).send('Token expired!')
                    next('Token expired!')
                } else {
                    console.log('token payload', payload)
                    // console.log('req', req.url)
                    next()
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
    .then((res) => console.log('Connected'))
    .catch((error) => console.log(error))

app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)
app.use("/api/redirects", redirectRoutes)

app.listen(PORT, (error) => {
    error ? error : console.log(`listening port ${PORT}`)
})

