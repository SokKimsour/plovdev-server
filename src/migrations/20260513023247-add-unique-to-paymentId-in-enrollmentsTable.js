'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addIndex('enrollments', ['paymentId'], {
      unique: true,
      name: 'enrollment_paymentId_unique'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('enrollments', 'enrollment_paymentId_unique');

  }
};
