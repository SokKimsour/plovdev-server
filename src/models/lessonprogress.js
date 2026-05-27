'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LessonProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LessonProgress.init({
    is_complete: DataTypes.BOOLEAN,
    last_position_secs: DataTypes.INTEGER,
    completedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    lessonId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LessonProgress',
  });
  return LessonProgress;
};