'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title : {
       type : Sequelize.STRING
      } ,
      courseId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "courses" , key : "id"
        } ,
        onDelete : "CASCADE",
        onUpdate : "CASCADE"
      },
      categoryId: {
        type: Sequelize.INTEGER ,
        references : {
          model : "categories" , key : "id"
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
    await queryInterface.dropTable('course_categories');
  }
};