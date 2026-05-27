'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class course_progress extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {foreignKey:"userId" , as : "user"})
      this.belongsTo(models.courses , {foreignKey:"courseId" , as : "course"})
    }
  }

  course_progress.init({
    total_lessons: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    completed_lessons: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 4),
      defaultValue: 0.0000,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_accessed: DataTypes.DATE,
    complete_at: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    lastLessonId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'course_progress',
    tableName: 'course_progresses', // Ensures it matches your migration table name
    underscored: false, // Set to true if you prefer snake_case columns in DB
  });

  return course_progress;
};
