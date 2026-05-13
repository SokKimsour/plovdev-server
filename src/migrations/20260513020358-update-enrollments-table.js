'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn("enrollments" , "paymentId" , {
      type : Sequelize.INTEGER ,
      references : {
        model : "payments" , 
        key : "id"
      } ,
      unique : true ,
      onDelete : "CASCADE" ,
      onUpdate : "CASCADE"
    })

     await queryInterface.addIndex('enrollments', ['userId', 'courseId'], {
      unique: true,
      name: 'user_course_enrollment_unique' 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("enrollments" , "paymentId")

     await queryInterface.removeIndex('enrollments', 'user_course_enrollment_unique');
  }
};
