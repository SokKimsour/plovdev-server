'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quizQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.TEXT , 
        allowNull : false
      },
      options: {
        type: Sequelize.JSONB ,
        allowNull : false
      },
      correct_answer: {
        type: Sequelize.STRING ,
        allowNull : false
      },
      explanation: {
        type: Sequelize.TEXT
      },
      position: {
        type: Sequelize.INTEGER
      },
      quizId: {
        type: Sequelize.INTEGER , references : {
          model :"Quizzes" , key : "id"
        },
        onDelete : "CASCADE",
        onUpdate : "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quizQuestions');
  }
};