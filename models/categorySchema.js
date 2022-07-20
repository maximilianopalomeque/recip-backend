const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  id: { type: Number, required: true },
});

module.exports = mongoose.model("Category", categorySchema);
