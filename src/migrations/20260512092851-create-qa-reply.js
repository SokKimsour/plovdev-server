'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QaReplies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      body: {
        type: Sequelize.TEXT
      },
      postId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "QaPosts" , key : "id"
        },
        onDelete : "CASCADE" ,
        onUpdate : "CASCADE"
      },
      userId: {
        type: Sequelize.INTEGER ,
         references : {
          model : "Users" , key : "id"
        } ,
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
    await queryInterface.dropTable('QaReplies');
  }
};