const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  idMeal: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryId: { type: mongoose.Types.ObjectId, required: true },
  instructions: { type: String, required: true },
  image: { type: String, required: true },
  tags: { type: String },
  video: { type: String },
  ingredientsAndMeasures: { type: Array, required: true },
});

module.exports = mongoose.model("Recipe", recipeSchema);
