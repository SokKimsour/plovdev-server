"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class teacher_profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      teacher_profiles.belongsTo(models.Users, {
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
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      yearsExp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payoutAccount: {
        type: DataTypes.STRING,
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
