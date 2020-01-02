module.exports = (sequelize, DataTypes) => {
  const cart_product = sequelize.define('cart_product',{
    amount: {
      type: DataTypes.INTEGER
    }
  })
  return cart_product
}