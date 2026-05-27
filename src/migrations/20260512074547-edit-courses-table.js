'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {


    await queryInterface.addColumn("courses" , "rejected_reason" , {
      type : Sequelize.TEXT 
    })

    await queryInterface.removeColumn("courses" , "is_published")
  },

  async down (queryInterface, Sequelize) {

      await queryInterface.removeColumn("courses" , "rejected_reason" , {
    })

    await queryInterface.addColumn("courses" , "is_published" , {
      type : Sequelize.BOOLEAN ,   defaultValue: false,
    })
  }
};
