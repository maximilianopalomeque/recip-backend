const Category = require("../models/categorySchema");
const CustomError = require("../models/CustomError");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .select("-_id -recipes -__v")
      .orFail();
    res.json({ categories: categories });
  } catch (error) {
    return next(new CustomError("could not get categories from db", 404));
  }
};

exports.getAllCategories = getAllCategories;
