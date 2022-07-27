const Recipe = require("../models/recipeSchema");
const User = require("../models/userSchema");
const CustomError = require("../models/CustomError");
const { validationResult } = require("express-validator");

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

const getUserRecipes = async (req, res, next) => {
  const { username } = req.params;

  try {
    const recipes = await User.findOne({ username: username })
      .populate("userRecipes")
      .orFail();
    res.json({ recipes: recipes.userRecipes });
  } catch (error) {
    return next(new CustomError("could not get user recipes from db", 404));
  }
};

const saveRecipe = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("invalid credentials, can't save recipe", 401));
  }

  const { username, recipeId } = req.body;

  let user;
  try {
    user = await User.findOne({ username: username }).orFail();
  } catch (error) {
    return next(new CustomError("user does not exists", 401));
  }

  user.userRecipes = [...user.userRecipes, recipeId];

  try {
    user.save();
  } catch (error) {
    return next(new CustomError("failed to save user", 404));
  }

  res.json({ message: "recipe saved", username: user.username });
};

const deleteRecipe = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new CustomError("invalid credentials, can't delete recipe", 401)
    );
  }

  const { username, recipeId } = req.body;

  let user;
  try {
    user = await User.findOne({ username: username }).orFail();
  } catch (error) {
    return next(new CustomError("user does not exists", 401));
  }

  user.userRecipes.pull(recipeId);

  try {
    user.save();
  } catch (error) {
    return next(new CustomError("failed to save user", 404));
  }

  res.json({ message: "recipe deleted", username: user.username });
};

exports.getAllRecipes = getAllRecipes;
exports.getRecipe = getRecipe;
exports.getUserRecipes = getUserRecipes;
exports.saveRecipe = saveRecipe;
exports.deleteRecipe = deleteRecipe;
