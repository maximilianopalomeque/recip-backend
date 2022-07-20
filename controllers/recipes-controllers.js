const Recipe = require("../models/recipeSchema");
const CustomError = require("../models/CustomError");
const Category = require("../models/categorySchema");

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().orFail();
    res.json({ recipes: recipes });
  } catch (error) {
    return next(new CustomError("could not get recipes from db", 404));
  }
};

const getRecipe = async (req, res, next) => {
  const recipeName = req.params.recipeName;

  try {
    const recipe = await Recipe.findOne({ name: recipeName }).orFail();
    res.json({ recipe: recipe });
  } catch (error) {
    return next(new CustomError("could not get recipe from db", 404));
  }
};

exports.getAllRecipes = getAllRecipes;
exports.getRecipe = getRecipe;
