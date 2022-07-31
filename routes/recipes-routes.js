const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getAllRecipes,
  getRecipe,
  saveRecipe,
  deleteRecipe,
  getUserRecipes,
} = require("../controllers/recipes-controllers");
const { checkAuth } = require("../middlewares/check-auth");

router.get("/all", getAllRecipes);

router.get("/:recipeName", getRecipe);

router.use(checkAuth);

router.get("/user/:username/", getUserRecipes);

router.post("/recipe/save", check("username").not().isEmpty(), saveRecipe);

router.delete(
  "/recipe/delete",
  check("username").not().isEmpty(),
  deleteRecipe
);

module.exports = router;
