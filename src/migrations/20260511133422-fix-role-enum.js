'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Remove old enum type and column
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" DROP COLUMN "role";
    `);

    // 2. Drop old enum type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role";
    `);

    // 3. Recreate with new values
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM('admin', 'user');
    `);

    // 4. Add column back with new enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN "role" "enum_Users_role" NOT NULL DEFAULT 'user';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`ALTER TABLE "Users" DROP COLUMN "role";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_role";`);
    await queryInterface.sequelize.query(`CREATE TYPE "enum_Users_role" AS ENUM('student', 'teacher', 'admin');`);
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ADD COLUMN "role" "enum_Users_role" NOT NULL DEFAULT 'student';`);
  }
};