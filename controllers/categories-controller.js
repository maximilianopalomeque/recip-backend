const Category = require("../models/categorySchema");
const CustomError = require("../models/CustomError");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .select("name image description id -_id")
      .orFail();
    res.json({ categories: categories });
  } catch (error) {
    return next(new CustomError("could not get categories from db", 404));
  }
};

const getCategoryData = async (req, res, next) => {
  const categoryName = req.params.categoryName;

  try {
    const category = await Category.findOne({ name: categoryName })
      .select("name image description -_id")
      .orFail();
    req.categoryData = category;
    next();
  } catch (error) {
    console.log(error);
    return next(new CustomError("could not get category data from db", 404));
  }
};

const getRecipesTitlesFromCategory = async (req, res, next) => {
  const categoryData = req.categoryData;
  const categoryName = req.categoryData.name;

  try {
    const category = await Category.findOne({ name: categoryName })
      .populate("recipes")
      .orFail();
    const recipesOfCategory = category.recipes;
    const filteredRecipesData = recipesOfCategory.map((r) => {
      return {
        name: r.name,
        image: r.image,
      };
    });

    res.json({
      categoryData: categoryData,
      previewRecipesData: filteredRecipesData,
    });
  } catch (error) {
    console.log("could not get recipes titles from db");
  }
};

exports.getAllCategories = getAllCategories;
exports.getRecipesTitlesFromCategory = getRecipesTitlesFromCategory;
exports.getCategoryData = getCategoryData;
