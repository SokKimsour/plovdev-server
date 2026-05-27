"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class enrollments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user",
      });

      this.belongsTo(models.courses, {
        foreignKey: "courseId",
        as: "course",
      });

      // payment not yet
    }
  }
  enrollments.init(
    {
      enrollmentAt: DataTypes.DATE,
      isCompleted: DataTypes.BOOLEAN,
      completeAt: DataTypes.DATE,
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      // payment not yet
    },
    {
      sequelize,
      modelName: "enrollments",
    },
  );
  return enrollments;
};
