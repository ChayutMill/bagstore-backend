module.exports = (sequelize, DataTypes) => {
  const brand = sequelize.define('brand', {
    name: {
      type: DataTypes.STRING(100)
    },
    image: {
      type: DataTypes.STRING(255)
    }
  });
  brand.associate =  (models) => {
    // associations can be defined here
    brand.hasMany(models.product, {foreignKey: 'brand_id'})
  };
  return brand;
};