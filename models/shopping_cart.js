module.exports = (sequelize, DataTypes) => {
  const shopping_cart = sequelize.define('shopping_cart');
  
  shopping_cart.associate = (models) => {
    shopping_cart.belongsTo(models.user, {foreignKey: 'user_id'})
    shopping_cart.belongsToMany(models.product, {foreignKey: 'shoppingcart_id', through: models.cart_product})
  }
  return shopping_cart;
};