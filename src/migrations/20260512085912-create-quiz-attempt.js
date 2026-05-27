'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quizAttempts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      answers: {
        type: Sequelize.JSONB
      },
      passed: {
        type: Sequelize.BOOLEAN
      },
      attempt_at: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER , 
        references : {
          model  : "Users" , key : "id"
        },
        onDelete : "CASCADE",
        onUpdate : "CASCADE"
      },
      quizId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "Quizzes" , key : "id"
        } ,
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
    await queryInterface.dropTable('quizAttempts');
  }
};