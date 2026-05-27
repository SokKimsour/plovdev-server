'use strict';

const { defaultValueSchemable } = require('sequelize/lib/utils');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LessonProgresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      is_complete: {
        type: Sequelize.BOOLEAN ,
        defaultValue : false
      },
      last_position_secs : {
      type : Sequelize.INTEGER
      } ,
      completedAt: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER ,
        references : {
          model : "Users" , key : "id"
        } , 
        onDelete : "CASCADE",
        onUpdate : "CASCADE"
      },
      lessonId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "lessons" , key : "id"
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
    await queryInterface.dropTable('LessonProgresses');
  }
};