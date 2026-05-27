'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user'
      });
      // A certificate belongs to a Course (using the 'courses' model name in this project)
      this.belongsTo(models.courses, {
        foreignKey: 'courseId',
        as: 'course'
      });
    }
  }
  Certificate.init({
    verification_id: DataTypes.STRING,
    issued_at: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Certificate',
  });
  return Certificate;
};