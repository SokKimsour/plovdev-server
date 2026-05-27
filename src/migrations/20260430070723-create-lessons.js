"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      videoUrl: {
        type: Sequelize.STRING,
      },
      videoPublicId: {
        type: Sequelize.STRING,
      },
      duration_secs: {
        type: Sequelize.INTEGER,
      },
      is_free_preview: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      position: {
        type: Sequelize.INTEGER,
      },
      sectionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lessons");
  },
};
