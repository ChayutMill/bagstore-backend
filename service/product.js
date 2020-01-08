const passport = require("passport");
module.exports = (app, db) => {
  app.get("/get-product-detail", (req, res) => {
    db.product
      .findOne({
        where: {
          id: req.query.productId
        }
      })
      .then(result => {
        res.send(result);
      });
  });

  app.get("/products", async (req, res) => {
    await db.product
      .findAll()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(400).json({
          message: err.message
        });
      });
  });
  app.post(
    "/add-product",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      if (req.user.role === "admin") {
        await db.product
          .create({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            description: req.body.description,
            image1: req.body.image1,
            image2: req.body.image2,
            image3: req.body.image3,
            brand_id: req.body.brand_id
          })
          .then(result => {
            res.status(201).json(result);
          })
          .catch(err => {
            console.error(err);
            res.status(400).json({
              message: err.message
            });
          });
      } else {
        res.status(401).send({
          message: "Unauthorized"
        });
      }
    }
  );
  app.put(
    "/update-product/:id",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      if (req.user.role === "admin") {
        let targetProduct = await db.product.findOne({
          where: {
            id: req.params.id
          }
        });
        if (!targetProduct) {
          res.status(400).send({
            message: "product is not found"
          });
        } else {
          targetProduct.update({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            description: req.body.description,
            image1: req.body.image1,
            image2: req.body.image2,
            image3: req.body.image3,
            brand_id: req.body.brand_id
          });
          res.status(200).json({
            message: "success"
          });
        }
      } else {
        res.status(401).send({
          message: "Unauthorized"
        });
      }
    }
  );
  app.delete(
    "/delete-product/:id",
    passport.authenticate("jwt", {
      session: false
    }),
    async function(req, res) {
      if (req.user.role === "admin") {
        let targetProduct = await db.product.findOne({
          where: {
            id: req.params.id
          }
        });
        if (!targetProduct) {
          res.status(400).send({
            message: "product is not found"
          });
        } else {
          targetProduct.destroy();
          res.status(200).json({
            message: "success"
          });
        }
      } else {
        res.status(401).send({
          message: "Unauthorized"
        });
      }
    }
  );
};
