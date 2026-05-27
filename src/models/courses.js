"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: "teacherId",
        as: "teacher",
      });

      this.hasMany(models.enrollments , {
        foreignKey : "courseId" ,
        as : "enrollments"
      })

      this.hasMany(models.sections , {
        foreignKey : "courseId" ,
        as : "sections"
    })

      this.belongsToMany(models.categories , {
        through: models.course_categories,
        foreignKey : "courseId" ,
        as : "category"
    })

      this.hasMany(models.course_progress , {
        foreignKey : "courseId" ,
        as : "course_progress"
    })

    this.hasMany(models.payments , {
      foreignKey : "courseId" , as : "payment"
    })

    
    }
  }
  courses.init(
    {
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      what_you_learn: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      archievedAt: {
        type: DataTypes.DATE,
      },
      thumbnailUrl: DataTypes.STRING,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      is_best_seller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      thumbnailPublicId: {
        type: DataTypes.STRING,
      },
      avgRating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      totalStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalReview: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_duration_secs: {
        type: DataTypes.INTEGER,
        allowNull : true,
        defaultValue : 0
      },
      status: {
        type: DataTypes.ENUM(
          "draft",
          "pending review",
          "published",
          "archived",
          "rejected",
        ),
        allowNull: false,
        defaultValue: "draft",
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rejected_reason: {
        type: DataTypes.TEXT,
        allowNull : true
      }
    },
    {
      sequelize,
      modelName: "courses",
    },
  );
  return courses;
};
