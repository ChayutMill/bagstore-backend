const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const userService = require('./service/user')

const db = require('./models')
const app = express()

app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

require('./config/passport/passport')
db.sequelize.sync({ force: true}).then(()=> {
  userService(app,db)
  app.listen(8080, () => {
    console.log('Server is running on port 8080')
  })
})