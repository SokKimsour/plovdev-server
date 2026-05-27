"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "is_active", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
    await queryInterface.addColumn("Users", "is_blocked", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "is_active");
    await queryInterface.removeColumn("Users", "is_blocked");

  },
};
