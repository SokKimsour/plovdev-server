'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TeacherPayout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TeacherPayout.init({
    periodMonth: DataTypes.DATE,
    totalEarned: DataTypes.DECIMAL,
    commissionDeducted: DataTypes.DECIMAL,
    netPayout: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    receipt_url: DataTypes.STRING,
    paidAt: DataTypes.DATE,
    teacherId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TeacherPayout',
  });
  return TeacherPayout;
};