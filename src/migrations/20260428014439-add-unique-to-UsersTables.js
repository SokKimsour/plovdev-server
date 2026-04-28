"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Users", {
      fields: ["userName"],
      type: "unique",
      name: "unique_users_userName",
    });

    await queryInterface.addConstraint("Users", {
      fields: ["email"],
      type: "unique",
      name: "unique_users_email",
    });

    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "fullName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Users", "unique_users_userName");
    await queryInterface.removeConstraint("Users", "unique_users_email");

    await queryInterface.changeColumn("Users", "fullName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("Users", "userName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
