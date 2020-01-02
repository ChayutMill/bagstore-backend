const env = process.env.NODE_ENV || 'development'
const config = require('../config.json')[env];
const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../../models')
const localStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const BCRYPT_SALT_ROUNDS = 12
let jwtOption = {}
jwtOption.secretOrKey = 'admin'
passport.use('register', new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
    },
    (email, password, done) => {
        db.user.findOne({
            where: { email: email }
        }).then(user => {
            if (user !== null) {
                console.log('Email already taken')
                return done(null, false, { message: 'Email already taken' }) //done(error, user, info)
            } else {
                let salt = bcrypt.genSaltSync(BCRYPT_SALT_ROUNDS)
                let hashedPassword = bcrypt.hashSync(password, salt)
                db.user.create({ email, password: hashedPassword })
                    .then(user => {
                        console.log("user created")
                        return done(null, user)
                    })
                    .catch(err => {
                        console.error(err)
                        done(err)
                    })
            }
        })
    }
))