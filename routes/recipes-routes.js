const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipe,
  saveRecipe,
  deleteRecipe,
} = require("../controllers/recipes-controllers");
const { checkAuth } = require("../middlewares/check-auth");

router.get("/", getAllRecipes);
router.get("/:recipeName", getRecipe);

router.use(checkAuth);

router.post("/recipe/save", saveRecipe);
router.delete("/recipe/delete", deleteRecipe);

module.exports = router;
