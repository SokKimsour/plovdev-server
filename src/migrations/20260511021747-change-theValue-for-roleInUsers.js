'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  // 1. Force the change using raw SQL with an explicit USING clause
  // This tells Postgres exactly how to convert the old text to the new ENUM
  await queryInterface.sequelize.query(`
    ALTER TABLE "Users" 
    ALTER COLUMN "role" TYPE "enum_Users_role" 
    USING ("role"::"enum_Users_role");
  `);

  // 2. Now that the type is fixed, set the default value
  await queryInterface.sequelize.query(`
    ALTER TABLE "Users" 
    ALTER COLUMN "role" SET DEFAULT 'user';
  `);
  },

  async down (queryInterface, Sequelize) {
    // This is the safe way to go back to 'teacher' if you ever need to
    await queryInterface.changeColumn("Users", "role", { type: Sequelize.STRING });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
    await queryInterface.changeColumn("Users", "role", {
      type: Sequelize.ENUM("admin", "teacher"),
      defaultValue: "teacher",
    });
  }
};
