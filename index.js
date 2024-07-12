const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cors = require('cors');

require('dotenv').config()

const PORT = process.env.PORT
const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}`

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(cors());

const authRoutes = require('./routes/auth-route')
const userRoutes = require('./routes/user-route')

mongoose
    .connect(db)
    .then((res) => console.log('Connected'))
    .catch((error) => console.log(error))

app.use("/api/auth", authRoutes)
app.use("/api", userRoutes)

app.listen(PORT, (error) => {
    error ? error : console.log(`listening port ${PORT}`)
})

