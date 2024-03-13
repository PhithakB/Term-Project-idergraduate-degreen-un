const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const pl =require('path-logger')

const levelRoute = require('./level/level')
const profileImgRoute = require('./profile_img/profile_img')
const accountRoute = require('./account/account')
const authRoute = require('./auth/auth')
const profileRoute = require('./profile/profile')
const bookmarkRoute = require('./bookmark/bookmark')
const watchHistoryRoute = require('./watch_history/watch_history')
const paymentRoute = require('./payment/payment')

const app = express()

app.use(cors())

app.use(bodyParser.json({limit:'3mb'}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/level' , levelRoute)
app.use('/api/profile_img' , profileImgRoute)
app.use('/api/account', accountRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)
app.use('/api/bookmark', bookmarkRoute)
app.use('/api/watch_history', watchHistoryRoute)
app.use('/api/payment', paymentRoute)

app.all('*', (req, res) => {
  res.sendStatus(404)
  pl.log(req, res)
})

app.listen(process.env.PORT,process.env.HOST, () => {
  console.log(`SERVER RUNNING AT http://${process.env.HOST}:${process.env.PORT}`);
})