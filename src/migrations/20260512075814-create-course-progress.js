'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_progresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_lessons: {
        type: Sequelize.INTEGER
      },
      completed_lessons: {
        type: Sequelize.INTEGER
      },
      percentage: {
        type: Sequelize.DECIMAL(5 , 4) ,
        defaultValue : 0.00
      },
      is_completed: {
        type: Sequelize.BOOLEAN , defaultValue : false
      },
      last_accessed: {
        type: Sequelize.DATE
      },
      complete_at: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "Users" , key : "id"
        } , 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      courseId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "courses" , key : "id"
        } , 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lastLessonId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "lessons" , key : "id"
        } , 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('course_progresses');
  }
};