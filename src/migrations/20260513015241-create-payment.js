'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(10 , 2 )
      },
      commission: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      teacherPayout: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      status: {
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      paid_at: {
        type: Sequelize.DATE
      },
      payment_method: {
        type: Sequelize.STRING
      },
      is_refunded: {
        type: Sequelize.BOOLEAN
      },
      refundedAt: {
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "Users" , key :"id" 
        } , 
        onDelete : "CASCADE" , 
        onUpdate : "CASCADE"
      },
      courseId: {
        type: Sequelize.INTEGER , 
        references : {
          model : "courses" , key :"id" 
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
    await queryInterface.dropTable('payments');
  }
};