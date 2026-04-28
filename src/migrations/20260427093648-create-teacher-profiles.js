'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teacher_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileUrl: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      yearsExp: {
        type: Sequelize.INTEGER
      },
      payoutAccount: {
        type: Sequelize.STRING
      },
      commissionRate: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.40
      },
      avgRating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.00
      },
      total_students: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id'   
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teacher_profiles');
  }
};
