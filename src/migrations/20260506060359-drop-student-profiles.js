'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_profiles') ;

    await queryInterface.addColumn("teacher_profiles" , "github_url" , {
      type : Sequelize.STRING 
    })

    await queryInterface.renameTable("teacher_profiles" ,"user_profiles")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable('student_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profile_publicId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      github_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

    await queryInterface.removeColumn("teacher_profiles" , "github_url")

    await queryInterface.renameTable("user_profiles" ,"teacher_profiles")

  }
}