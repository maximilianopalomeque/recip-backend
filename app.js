const { db_url, port } = require(".config");

const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

const CustomError = require("./models/CustomError");

const recipesRoutes = require("./routes/recipes-routes");
const categoriesRoutes = require("./routes/categories-routes");

app.use(express.json());

app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "*",
    preflightContinue: true,
  })
);

app.use("/recipes", recipesRoutes);
app.use("/categories", categoriesRoutes);

app.use((req, res, next) => {
  const error = new CustomError("could not find the route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error ocurred" });
});

mongoose
  .connect(db_url)
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log("could not connect to db");
  });

app.listen(port);
