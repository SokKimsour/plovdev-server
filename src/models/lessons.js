'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lessons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.sections, {
        foreignKey: 'sectionId',
        as: 'section'
      })
    }
  }
  lessons.init({
    title: DataTypes.STRING,
    videoUrl: DataTypes.STRING,
    videoPublicId: DataTypes.STRING,
    duration_secs: DataTypes.INTEGER,
    is_free_preview: DataTypes.BOOLEAN,
    position: DataTypes.INTEGER,
    sectionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'lessons',
  });
  return lessons;
};