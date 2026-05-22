'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Quiz , {foreignKey : "quizId" , as : "quiz"})
      this.belongsTo(models.Users , {foreignKey : "userId" , as : "user"})
    }
  }
  QuizAttempt.init({
    answers: DataTypes.JSONB,
    passed: DataTypes.BOOLEAN,
    attempt_at: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    quizId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuizAttempt',
  });
  return QuizAttempt;
};