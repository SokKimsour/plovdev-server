'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OtpCode extends Model {
    static associate(models) {
      // OTP belongs to a User
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }

  OtpCode.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'OtpCode',
    tableName: 'otp_codes',
  });

  return OtpCode;
};