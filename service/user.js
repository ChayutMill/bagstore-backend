const passport = require('passport');

const jwt = require('jsonwebtoken');
const config = require('../config/passport/passport');
const bcrypt = require('bcryptjs')

module.exports = (app, db) => {
    app.post('/registerUser', (req, res, next) => {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                console.error(err);
            }
            if (info !== undefined) {
                console.error(info.message);
                res.status(403).send(info.message);
            } else {
                db.user.findOne({
                    where: {
                      email: user.email,
                    },
                }).then(user => {
                    user.update({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            tel: req.body.tel,
                            address: req.body.address,
                            role: 'customer'
                        })
                        .then(() => {
                            console.log('user created in db');
                            res.status(200).send({ message: 'user created' });
                        });
                })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })(req, res, next);
    });

    app.post('/loginUser', (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
          if (err) {
            console.error(`error ${err}`);
          }
          if (info !== undefined) {
            console.error(info.message);
            if (info.message === 'The email or password you entered is incorrect, please try again.') {
              res.status(401).send(info.message);
            } else {
              res.status(403).send(info.message);
            }
          } else {
            db.user.findOne({
              where: {
                email: req.body.email,
              },
            }).then(user => {
              const token = jwt.sign({
                id: user.id,
                role: user.role,
                name: user.firstname,
              }, config.jwtOption.secretOrKey, {
                expiresIn: 3600,
              });
              res.status(200).send({
                auth: true,
                token,
                message: 'user found & logged in',
              });
            });
          }
        })(req, res, next);
      }
    );
}