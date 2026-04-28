'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class refreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      refreshTokens.belongsTo(models.Users, { 
        foreignKey: 'userId',
        as : "user"
      })
    }
  }
  refreshTokens.init({
    token: DataTypes.STRING,
    expireAt: DataTypes.DATE,
    userId: DataTypes.INTEGER ,
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'refreshTokens',
  });
  return refreshTokens;
};