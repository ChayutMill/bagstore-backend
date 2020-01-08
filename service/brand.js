const passport = require("passport");
module.exports = (app, db) => {
  app.get("/brands", async (req, res) => {
    await db.brand
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
    "/add-brand",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      if (req.user.role === "admin") {
        await db.brand
          .create({
            name: req.body.name,
            image: req.body.image
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
    "/update-brand/:id",
    passport.authenticate("jwt", {
      session: false
    }),
    async (req, res) => {
      if (req.user.role === "admin") {
        let targetBrand = await db.brand.findOne({
          where: {
            id: req.params.id
          }
        });
        if (!targetBrand) {
          res.status(400).send({
            message: "brand is not found"
          });
        } else {
          targetBrand.update({
            name: req.body.name,
            image: req.body.image
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
    "/delete-brand/:id",
    passport.authenticate("jwt", {
      session: false
    }),
    async function(req, res) {
      if (req.user.role === "admin") {
        let targetBrand = await db.brand.findOne({
          where: {
            id: req.params.id
          }
        });
        if (!targetBrand) {
          res.status(400).send({
            message: "brand is not found"
          });
        } else {
          targetBrand.destroy();
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

  app.post("/upload-photo", async (req, res) => {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: "No file uploaded"
        });
      } else {
        //Use the name of the input field (i.e. "photo") to retrieve the uploaded file
        let photo = req.files.photo;
        let photoName = new Date().getTime() + ".jpeg";
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        photo.mv("./uploads/" + photoName);
        //send response
        res.send({
          status: true,
          message: "File is uploaded",
          data: {
            name: photoName,
            mimetype: photo.mimetype,
            size: photo.size
          }
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  });
};
