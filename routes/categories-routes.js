const express = require("express");
const router = express.Router();
const {
  getCategoryData,
  getRecipesTitlesFromCategory,
  getAllCategories,
} = require("../controllers/categories-controller");

router.get("/", getAllCategories);
router.get("/:categoryName", getCategoryData, getRecipesTitlesFromCategory);

module.exports = router;
