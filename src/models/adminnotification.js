'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class admin_notifications extends Model {
    static associate(models) {
      // An admin notification belongs to a user (student who enrolled)
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user'
      });
      // An admin notification belongs to a course (the course they purchased)
      this.belongsTo(models.courses, {
        foreignKey: 'courseId',
        as: 'course'
      });
    }
  }

  admin_notifications.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'admin_notifications',
    tableName: 'admin_notifications',
  });

  return admin_notifications;
};
