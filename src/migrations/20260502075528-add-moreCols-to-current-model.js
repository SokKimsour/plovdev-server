"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn("courses", "archievedAt", {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn("courses", "status", {
      type: Sequelize.ENUM(
        "draft",
        "pending review",
        "published",
        "archived",
        "rejected",
      ),
      defaultValue: "draft",
    });

    await queryInterface.addColumn("teacher_profiles", "accountName", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("teacher_profiles", "accountNumber", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("teacher_profiles", "khqr_url", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("teacher_profiles", "khqr_publicId", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("teacher_profiles", "is_verified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("courses", "archievedAt");
    await queryInterface.removeColumn("courses", "status");
    await queryInterface.removeColumn("teacher_profiles", "accountName");
    await queryInterface.removeColumn("teacher_profiles", "accountNumber");
    await queryInterface.removeColumn("teacher_profiles", "khqr_url");
    await queryInterface.removeColumn("teacher_profiles", "khqr_publicId");
    await queryInterface.removeColumn("teacher_profiles", "is_verified");
  },
};
