module.exports = (sequelize, DataTypes) => {
  const product_order = sequelize.define("product_order", {

    amount: {
      type: DataTypes.INTEGER
    }
  });
  product_order.associate = (models) => {
    product_order.belongsToMany(models.product, {foreignKey: 'productOrder_id', through: models.product_clone})
    product_order.belongsTo(models.bill, {foreignKey: 'bill_id'})
  }
  return product_order;
};