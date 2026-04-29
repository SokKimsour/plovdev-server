"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // One-to-One: A User can have one Teacher Profile
      this.hasOne(models.teacher_profiles, {
        foreignKey: "userId",
        as: "teacherProfile",
      });

      this.hasMany(models.OtpCode, {
        foreignKey: "userId",
        as: "otpcode",
      });

      this.hasMany(models.refreshTokens, {
        foreignKey: "userId",
        as: "refreshTokens",
      });

      this.hasOne(models.student_profiles, {
        foreignKey: "userId",
        as: "studentProfile",
      });

      this.hasMany(models.courses, {
        foreignKey: "teacherId",
        as: "courses",
      }); 
    }
  }

  Users.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNumber: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM("student", "teacher", "admin"),
        defaultValue: "student",
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "Users",
    },
  );

  return Users;
};
