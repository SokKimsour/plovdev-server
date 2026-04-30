"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: "teacherId",
        as: "teacher",
      });
    }
  }
  courses.init(
    {
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      what_you_learn: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      thumbnailUrl: DataTypes.STRING,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      is_best_seller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      thumbnailPublicId: {
        type: DataTypes.STRING,
      },
      avgRating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      totalStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalReview: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "courses",
    },
  );
  return courses;
};
