'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('certificates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      verification_id: {
        type: Sequelize.STRING
      },
      issued_at: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER ,
          references : {
          model : "Users" , key : "id"
        } ,
        onDelete : "CASCADE" ,
        onUpdate : "CASCADE"
      },
      courseId: {
        type: Sequelize.INTEGER , 
          references :{
          model : "courses" , key : "id"
        }, 
        onDelete : "CASCADE" ,
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
    await queryInterface.dropTable('certificates');
  }
};