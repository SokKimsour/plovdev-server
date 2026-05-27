'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Users" DROP CONSTRAINT "unique_users_userName";'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE "Users" DROP CONSTRAINT "unique_users_email";'
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Users" ADD CONSTRAINT "unique_users_userName" UNIQUE ("userName");'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE "Users" ADD CONSTRAINT "unique_users_email" UNIQUE ("email");'
    );
  }
};