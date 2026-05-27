'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.courses, { foreignKey: 'courseId' , as : "course"});
      this.belongsTo(models.sections, { foreignKey: 'sectionId' ,as : "section"});
      this.hasMany(models.QuizQuestion, { foreignKey: 'quizId', as: 'questions' });
      this.hasMany(models.QuizAttempt, { foreignKey: 'quizId', as: 'attempts' });
    }
  }
  Quiz.init({
    title: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
    sectionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName : "Quizzes"
  });
  return Quiz;
};