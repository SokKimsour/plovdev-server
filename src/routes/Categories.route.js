const express = require("express");
const router = express.Router();

const {
  createCategory,
  viewCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/Categories.controller");
const { isAdmin, authenticateToken } = require("../middlewares/authMiddleWare");
const { route } = require("./Section.route");
const { authenticate } = require("passport");

router.post("/category", /* #swagger.tags = ['Category'] */ authenticateToken, isAdmin, createCategory);
router.get("/category", /* #swagger.tags = ['Category'] */  viewCategory);
router.put("/category", /* #swagger.tags = ['Category'] */ authenticateToken, isAdmin, updateCategory);
router.delete("/category", /* #swagger.tags = ['Category'] */ authenticateToken, isAdmin, deleteCategory);

module.exports = router;
