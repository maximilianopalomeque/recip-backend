const axios = require("axios");
const mongoose = require("mongoose");
const { db_url, categories_url } = require("../config");

const Category = require("../models/categorySchema");

const setupCategories = async () => {
  const getCategories = async () => {
    try {
      const response = await axios(categories_url);
      return response.data?.categories;
    } catch (error) {
      console.log("failed to fetch from categories url", error);
    }
  };

  const categories = await getCategories();
  if (!categories) {
    console.log("could not get categories");
    return;
  }

  for (let category of categories) {
    const categoryObject = new Category({
      name: category.strCategory,
      image: category.strCategoryThumb,
      description: category.strCategoryDescription,
      recipes: [],
    });

    try {
      await categoryObject.save();
    } catch {
      console.log("could not save category: ", categoryObject.name);
    }
  }

  console.log("saved to db");
};

mongoose
  .connect(db_url)
  .then(() => {
    setupCategories();
  })
  .catch((error) => {
    console.log("could not connect to db");
  });
