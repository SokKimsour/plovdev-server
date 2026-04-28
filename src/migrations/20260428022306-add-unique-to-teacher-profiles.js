'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('teacher_profiles', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_teacher_profiles_userId'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('teacher_profiles', 'unique_teacher_profiles_userId')
  }
}