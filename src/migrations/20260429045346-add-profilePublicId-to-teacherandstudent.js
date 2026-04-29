"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("student_profiles", "profilePublicId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("teacher_profiles", "profilePublicId", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn("student_profiles", "profilePublicId");
    await queryInterface.removeColumn("teacher_profiles", "profilePublicId");
  },
};
