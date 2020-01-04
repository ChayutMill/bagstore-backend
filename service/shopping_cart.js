const passport = require('passport')
module.exports = (app, db) => {
    app.get('/carts', passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            let targetCart = await db.cart.findOne({ where: { userId: req.user.id } })
            if (!targetCart) {
                res.status(400).send({ message: "Cart is not found" })
            } else {
                targetCart.findAll()
                    .then(result => {
                        res.status(200).json(result)
                    })
                    .catch(err => {
                        res.status(400).json({ message: err.message })
                    })
            }
        })
}