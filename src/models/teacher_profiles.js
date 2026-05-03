"use strict";
const { Model, STRING } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class teacher_profiles extends Model {
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
  teacher_profiles.init(
    {
      profileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      yearsExp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      commissionRate: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.4,
      },
      avgRating: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0,
      },
      total_students: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      accountName: STRING,
      accountNumber: STRING,
      khqr_url: STRING,
      khqr_publicId: STRING,
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "teacher_profiles",
    },
  );
  return teacher_profiles;
};
