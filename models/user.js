module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING(255)
    },
    password: {
      type: DataTypes.STRING(255)
    },
    firstname: {
      type: DataTypes.STRING(100)
    },
    lastname: {
      type: DataTypes.STRING(100)
    },
    address: {
      type: DataTypes.STRING(500)
    },
    tel: {
      type: DataTypes.STRING(20)
    },
    role: {
      type: DataTypes.ENUM("admin", "customer")
    }
  })

  user.associate = (models) => {

    user.hasOne(models.shopping_cart, {foreignKey: 'user_id'})
    user.hasMany(models.bill, {foreignKey:'user_id'})
  }
  return user
}