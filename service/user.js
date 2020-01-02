const passport = require('passport');
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
}