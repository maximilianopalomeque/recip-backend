const express = require("express");
const router = express.Router();
const recipesControllers = require("../controllers/recipes-controllers");

router.get("/all", recipesControllers.getAllRecipes);
router.get("/:category", recipesControllers.getRecipesByCategory);

module.exports = router;
