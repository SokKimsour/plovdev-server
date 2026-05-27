'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TeacherPayouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      periodMonth: {
        type: Sequelize.DATE
      },
      totalEarned: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      commissionDeducted: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      netPayout: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      status: {
        type: Sequelize.STRING
      },
      payment_method: {
        type: Sequelize.STRING
      },
      receipt_url: {
        type: Sequelize.STRING
      },
      paidAt: {
        type: Sequelize.DATE
      },
      teacherId: {
        type: Sequelize.INTEGER ,
        references : {
          model : "Users" , key : "id"
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
    await queryInterface.dropTable('TeacherPayouts');
  }
};