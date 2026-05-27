'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wishlists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id'
        },
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
    })

    // ADD COMPOSITE UNIQUE CONSTRAINT
    await queryInterface.addConstraint('Wishlists', {
      fields: ['userId', 'courseId'],
      type: 'unique',
      name: 'unique_user_course_wishlist'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Wishlists', 'unique_user_course_wishlist')
    await queryInterface.dropTable('Wishlists')
  }
}