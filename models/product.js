module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define("product", {

    name: {
      type: DataTypes.STRING(100)
    },

    image1: {
      type: DataTypes.STRING(255)
    },

    image2: {
      type: DataTypes.STRING(255)
    },
    image3: {
      type: DataTypes.STRING(255)
    },
    description: {
      type: DataTypes.STRING(500)
    },
    amount: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.DECIMAL(10, 2)
    }
  });
  product.associate = (models) => {
    product.belongsToMany(models.shopping_cart, {foreignKey: 'product_id',through: models.cart_product})
    product.belongsTo(models.brand, {foreignKey: 'brand_id'})
    product.belongsToMany(models.product_order, {foreignKey: 'product_id', through: models.product_clone})

  }
  return product;
};