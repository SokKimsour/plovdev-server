'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'user';
    `);

    await queryInterface.sequelize.query(`
      UPDATE "Users" SET "role" = 'user' WHERE "role" IN ('student', 'teacher');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" DROP COLUMN "role";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role";
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM('admin', 'user');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN "role" "enum_Users_role" NOT NULL DEFAULT 'user';
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`ALTER TABLE "Users" DROP COLUMN "role";`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Users_role";`);
    await queryInterface.sequelize.query(`CREATE TYPE "enum_Users_role" AS ENUM('student', 'teacher', 'admin');`);
    await queryInterface.sequelize.query(`ALTER TABLE "Users" ADD COLUMN "role" "enum_Users_role" NOT NULL DEFAULT 'student';`);
  }
};