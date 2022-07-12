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

const getRecipesByCategory = async (req, res, next) => {
  const categoryName = req.params.category;

  try {
    const category = await Category.findOne({ name: categoryName })
      .populate("recipes")
      .orFail();
    res.json({ recipes: category.recipes });
  } catch (error) {
    return next(new CustomError("could not get recipes by category", 404));
  }
};

exports.getAllRecipes = getAllRecipes;
exports.getRecipesByCategory = getRecipesByCategory;
