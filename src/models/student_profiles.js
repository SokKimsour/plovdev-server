"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class student_profiles extends Model {
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
    }
  }
  student_profiles.init(
    {
      profileUrl: DataTypes.STRING,
      profilePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: DataTypes.TEXT,
      github_url: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "student_profiles",
    },
  );
  return student_profiles;
};
