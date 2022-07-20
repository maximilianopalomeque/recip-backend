const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipe,
} = require("../controllers/recipes-controllers");

router.get("/", getAllRecipes);
router.get("/:recipeName", getRecipe);

module.exports = router;
