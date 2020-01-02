module.exports = (sequelize, DataTypes) => {
  const bill = sequelize.define("bill", {

    total_price: {
      type: DataTypes.DECIMAL(10, 2)
    }
  });
  bill.associate =  (models) => {
    // associations can be defined here
    bill.hasMany(models.product_order, {foreignKey: 'bill_id'})
    bill.belongsTo(models.user, {foreignKey: 'user_id'})
  };
  return bill;
};