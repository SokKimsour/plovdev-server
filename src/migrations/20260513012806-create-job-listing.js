'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobListings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.STRING
      },
      hr_name: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      emp_type: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      salary_min: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      salary_max: {
        type: Sequelize.DECIMAL(10 , 2)
      },
      skills: {
        type: Sequelize.JSONB
      },
      contact_email: {
        type: Sequelize.STRING
      },
      apply: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      applicants: {
        type: Sequelize.INTEGER
      },
      rejectedAt: {
        type: Sequelize.DATE
      },
      publishedAt: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM("pending review" , "published" , "rejected"), 
        defaultValue : "pending review"
      },
      open_positions: {
        type: Sequelize.INTEGER
      },
      company_logo: {
        type: Sequelize.STRING
      },
      expires_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jobListings');
  }
};