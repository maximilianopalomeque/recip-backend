// save recipe ids in each category
const { db_url } = require("../config");
const mongoose = require("mongoose");
const Category = require("../models/categorySchema");
const Recipe = require("../models/recipeSchema");

const createRelation = async () => {
  const getCategoriesNames = async () => {
    try {
      const categories = await Category.find();
      return categories.map((c) => c.name);
    } catch (error) {
      console.log("failed to fetch from categories url", error);
    }
  };

  const getCategoryObj = async (categoryName) => {
    try {
      const category = await Category.findOne({ name: categoryName });
      return category;
    } catch (error) {
      console.log("failed to fetch from category obj", error);
    }
  };

  const getRecipesIdsFromCategory = async (categoryName) => {
    try {
      const recipes = await Recipe.find({ category: categoryName });
      return recipes.map((r) => r._id);
    } catch (error) {
      console.log("failed to fetch from categories url", error);
    }
  };

  // ---

  const categoriesNames = await getCategoriesNames();
  if (!categoriesNames) {
    console.log("could not get categories names");
    return;
  }

  for (let categoryName of categoriesNames) {
    const categoryMongooseObj = await getCategoryObj(categoryName);
    if (categoryMongooseObj) {
      const recipesIdsOfCategory = await getRecipesIdsFromCategory(
        categoryMongooseObj.name
      );
      if (recipesIdsOfCategory) {
        for (let recipeId of recipesIdsOfCategory) {
          categoryMongooseObj.recipes.push(recipeId);
        }
      }

      try {
        await categoryMongooseObj.save();
      } catch (error) {
        console.log("could not save category to db");
      }
    }
  }

  console.log("relation created");
};

mongoose
  .connect(db_url)
  .then(() => {
    console.log("connected to db");
    createRelation();
  })
  .catch((error) => {
    console.log("could not connect to db");
  });
