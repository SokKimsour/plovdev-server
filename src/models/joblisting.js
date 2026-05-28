'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobListing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JobListing.init({
    company_name: DataTypes.STRING,
    hr_name: DataTypes.STRING,
    title: DataTypes.STRING,
    emp_type: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    salary_min: DataTypes.DECIMAL(10 , 2),
    salary_max: DataTypes.DECIMAL(10 , 2),
    skills: DataTypes.JSONB,
    experience: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    apply: DataTypes.STRING,
    source: DataTypes.STRING,
    applicants: DataTypes.INTEGER,
    rejectedAt: DataTypes.DATE,
    publishedAt: DataTypes.DATE,
    status: {
     type : DataTypes.ENUM("pending review" , "published" , "rejected"),
     defaultValue  : 'pending review' 
    } ,
    open_positions: DataTypes.INTEGER,
    company_logo: DataTypes.STRING,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'JobListing',
    tableName: 'jobListings',
  });
  return JobListing;
};