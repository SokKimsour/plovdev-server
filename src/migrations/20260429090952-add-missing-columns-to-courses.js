'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('courses', 'original_price', {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  })

  await queryInterface.addColumn('courses', 'is_best_seller', {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  })

  await queryInterface.addColumn('courses', 'what_you_learn', {
    type: Sequelize.TEXT,
    allowNull: true
  })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('courses', 'original_price');
    await queryInterface.removeColumn('courses', 'is_best_seller');
    await queryInterface.removeColumn('courses', 'what_you_learn');
  }
};
