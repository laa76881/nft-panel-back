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

//token verify
app.use((req, res, next) => {
    console.log('autorization', req.headers.authorization)
    if (req.headers.authorization) {
        console.log('1', req.headers.authorization.split(' ')[1])
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET,
            (err, payload) => {
                console.log('token err', err)
                if (err) {
                    res.status(500).send('Token expired!')
                    next('Token expired!')
                }
                console.log('token payload', payload)
            }
        );
    }

    next();
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

