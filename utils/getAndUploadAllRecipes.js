const axios = require("axios");
const mongoose = require("mongoose");
const Recipe = require("../models/recipeSchema");
const Category = require("../models/categorySchema");

const {
  categories_url,
  single_category_url,
  meal_id_url,
  db_url,
} = require("../config");

const getAndUploadAllRecipes = async () => {
  const getCategoriesNames = async () => {
    try {
      const response = await axios(categories_url);
      const categories = response.data?.categories;
      return categories.map((c) => c.strCategory);
    } catch (error) {
      console.log("failed to fetch from categories url", error);
    }
  };

  const getRecipesIdsFromCategory = async (category) => {
    try {
      const response = await axios(single_category_url + category);
      const meals = response.data?.meals;
      return meals.map((meal) => meal.idMeal);
    } catch (error) {
      console.log("failed to fetch meals of category: ", category);
    }
  };

  const getRecipe = async (id) => {
    try {
      const response = await axios(meal_id_url + id);
      const recipe = response.data?.meals[0];
      if (!recipe) {
        throw new Error();
      }
      return recipe;
    } catch (error) {
      console.log("failed to fetch with meal id: ", id);
    }
  };

  const getRecipesById = async (ids) => {
    let recipes = [];
    for (let id of ids) {
      const recipe = await getRecipe(id);
      if (recipe) {
        recipes = [...recipes, recipe];
      }
    }
    return recipes;
  };

  // -- get recipes from API

  const categoriesNames = await getCategoriesNames();
  if (!categoriesNames) {
    console.log("could not get categories names");
    return;
  }

  let allRecipes = [];
  for (let category of categoriesNames) {
    const mealsIds = await getRecipesIdsFromCategory(category);
    if (mealsIds) {
      const recipes = await getRecipesById(mealsIds);
      if (recipes) {
        allRecipes = [...allRecipes, ...recipes];
      }
    }
  }

  // -- upload to db

  const organizeIngredientsAndMeasures = (recipe) => {
    // convert to key-value array to get ingredients and measures
    const ingredients = Object.entries(recipe).filter((e) =>
      e[0].includes("Ingredient")
    );

    const measures = Object.entries(recipe).filter((e) =>
      e[0].includes("Measure")
    );

    // max 20 ingredients
    let ingredientsAndMeasures = [];
    for (let i = 0; i < 20; i++) {
      const actualIngredient = ingredients[i];
      const actualMeasure = measures[i];

      if (!actualIngredient[1]) {
        return ingredientsAndMeasures;
      }

      const ingredientsAndMeasuresObj = {
        name: actualIngredient[1],
        measure: actualMeasure[1],
      };

      ingredientsAndMeasures = [
        ...ingredientsAndMeasures,
        ingredientsAndMeasuresObj,
      ];
    }

    return ingredientsAndMeasures;
  };

  const getCategoryId = async (recipe) => {
    const recipeCategory = recipe.strCategory;

    try {
      const category = await Category.findOne({ name: recipeCategory });
      return category._id.toString();
    } catch (error) {
      console.log("could not get category from db");
    }
  };

  const createMongooseObj = async (recipe) => {
    const ingredients = organizeIngredientsAndMeasures(recipe);
    const categoryId = await getCategoryId(recipe);

    const recipeObj = new Recipe({
      idMeal: recipe.idMeal,
      name: recipe.strMeal,
      category: recipe.strCategory,
      categoryId: categoryId,
      instructions: recipe.strInstructions,
      image: recipe.strMealThumb,
      tags: recipe.strTags,
      video: recipe.strYoutube,
      ingredientsAndMeasures: ingredients,
    });

    return recipeObj;
  };

  // ----

  if (!allRecipes) {
    console.log("could not get all recipes");
    return;
  }

  for (let recipe of allRecipes) {
    const recipeMongooseObj = await createMongooseObj(recipe);
    try {
      await recipeMongooseObj.save();
    } catch (error) {
      console.log(
        "could not save to db, recipe name: ",
        recipeMongooseObj.name
      );
      console.log(error);
    }
  }

  console.log("saved to db");
};

mongoose
  .connect(db_url)
  .then(() => {
    console.log("connected to db");
    getAndUploadAllRecipes();
  })
  .catch((error) => {
    console.log("could not connect to db");
  });
