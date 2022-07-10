const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  categories_url: process.env.CATEGORIES_URL,
  single_category_url: process.env.SINGLE_CATEGORY_URL,
  meal_id_url: process.env.MEAL_ID_URL,
  db_url: process.env.DB_URL,
  port: process.env.PORT,
};
