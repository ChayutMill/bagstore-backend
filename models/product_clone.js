module.exports = (sequelize, DataTypes) => {
  const product_clone = sequelize.define('product_clone',{
    price: {
      type: DataTypes.DECIMAL(10, 2)
    }
  })
  return product_clone
}