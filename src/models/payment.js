'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.courses , {
        foreignKey : "courseId" , as : "course"
      })
    }
  }
  payments.init({
    amount: DataTypes.DECIMAL(10 , 2 ),
    commission: DataTypes.DECIMAL(10 , 2 ),
    teacherPayout: DataTypes.DECIMAL(10 , 2 ),
    status: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    paid_at: DataTypes.DATE,
    payment_method: DataTypes.STRING,
    is_refunded: DataTypes.BOOLEAN,
    refundedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'payments',
  });
  return payments;
};