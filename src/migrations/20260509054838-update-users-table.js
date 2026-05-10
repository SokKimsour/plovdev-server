'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("Users" ,  "google_id" ,{
      type : Sequelize.STRING , unique : true
    })

    await queryInterface.addColumn("Users" , "auth_provider", {
      type : Sequelize.ENUM("local" , "google") , allowNull : false , defaultValue : "local"
    })

    await queryInterface.changeColumn("Users" , "password", {
      type : Sequelize.STRING ,  allowNull : true
    })
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Remove the added columns
    await queryInterface.removeColumn("Users", "google_id");
    await queryInterface.removeColumn("Users", "auth_provider");
  }
};
