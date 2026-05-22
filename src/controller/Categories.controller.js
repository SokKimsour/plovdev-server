const { Op } = require("sequelize");
const { categories, courses, sections, lessons } = require("../models");
const AppError = require("../utils/appError");

// FOR ADMIN ONLY THAT CAN DO ALL OF THESE 
// VIEW COURSES EVERYONE CAN VIEW IT

const createCategory = async (req, res) => {
  const { name, iconUrl } = req.body;

  if (!name) {
    throw new AppError("Category name is required!", 400);
  }

  // CHECK IF CATEGORY ALREADY EXISTS FIRST
  const existing = await categories.findOne({ where: { name } });
  if (existing) {
    throw new AppError("Category already exists!", 400);
  }

  const category = await categories.create({
    name,
    iconUrl,
  });

  // Create Then Fetch Pattern
  const newCategory = await categories.findByPk(category.id);

  res.status(201).json({
    status: "success",
    message: "Create category for course successfully!",
    data: newCategory,
  });
};


// Wrap with your async error handler if you use one (e.g., catchAsync)
const viewCategory = async (req, res) => {
  
  const whereaCondition = {};
  let categoryId = req.query.categoryId;
  
  if (categoryId) {
    whereaCondition.id = {
      [Op.eq]: categoryId
    };
  } 

  const allCategories = await categories.findAll({
    attributes: ['id', 'name', 'iconUrl'],
    where: whereaCondition,
    include: [{
      model: courses,
      as: 'courses',
      attributes: ['id', 'title_en', 'price', 'thumbnailUrl', 'avgRating', 'totalStudents'],
      through: { attributes: [] },  
      include: [{
        model: sections,
        as: 'sections',
        attributes: ['id', 'title', 'position'],
        include: [{
          model: lessons,
          as: 'lessons',
          attributes: ['id', 'title', 'duration_secs', 'is_free_preview', 'position']
        }]
      }]
    }]
  });

  
  res.json({
    status: "success",
    message: "Categories for course retrieved successfully!",
    data: allCategories,
  });


};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, iconUrl } = req.body;

  const findCategory = await categories.findByPk(id);
  if (!findCategory) {
    throw new AppError("Category not found!", 404);
  }

  // PREVENT OVERWRITE VALUE WHEN ADMIN IS NOT CLICK CONFIRM BUTTON
  // OR PREVENT FROM UNDEFINED AND NULL VALUE (Using findCategory instead of category to fix runtime crash)
  await findCategory.update({
    name: name || findCategory.name,
    iconUrl: iconUrl || findCategory.iconUrl
  });

  const updatedCategory = await categories.findByPk(id);

  res.status(200).json({
    status: "success",
    message: "Update category for course successfully!",
    data: updatedCategory,
  });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await categories.findByPk(id);
  if (!category) {
    throw new AppError("Category not found!", 404);
  }

  await category.destroy();

  res.status(200).json({
    status: "success",
    message: "Delete category for course successfully!",
  });
};

module.exports = {
  createCategory,
  viewCategory,
  updateCategory,
  deleteCategory
};
