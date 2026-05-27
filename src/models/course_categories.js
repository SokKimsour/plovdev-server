'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class course_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.categories , {
        foreignKey : "categoryId"
      })
      this.belongsTo(models.courses , {
        foreignKey : "courseId"
      })
    }
  }
  course_categories.init({
    title : String,
    courseId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'course_categories',
  });
  return course_categories;
};