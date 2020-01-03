const env = process.env.NODE_ENV || 'development'
const config = require('../config.json')[env];
const bcrypt = require('bcryptjs')
const passport = require('passport')
const db = require('../../models')
const localStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
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
            where: { email }
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
passport.use('login', new localStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
    },
    (email, password, done) => {
        try {
            db.user.findOne({
                where: { email },
            }).then(user => {
                if (user === null) {
                    return done(null, false, { message: 'The email or password you entered is incorrect, please try again.' });
                }
                console.log(user.password)
                bcrypt.compare(password, user.password, function (err, response) {
                    console.log({ response })
                    if (err) {
                        console.log(err)
                        done(err)
                    }
                    if (response !== true) {
                        console.log('passwords do not match');
                        return done(null, false, { message: 'passwords do not match' });
                    }
                    console.log('user found & authenticated');
                    return done(null, user);
                });
            });
        } catch (err) {
            done(err);
        }
    },
),
);
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtOption.secretOrKey,
};
passport.use(
    'jwt',
    new JWTStrategy(opts, (jwt_payload, done) => {
        try {
            console.log("test")
            db.user.findOne({
                where: {
                    id: jwt_payload.id,
                },
            }).then(user => {
                if (user) {
                    console.log('user found in db in passport');
                    done(null, user);
                } else {
                    console.log('user not found in db');
                    done(null, false);
                }
            });
        } catch (err) {
            console.log(err)
            done(err);
        }
    }),
);
module.exports = { jwtOption, BCRYPT_SALT_ROUNDS }