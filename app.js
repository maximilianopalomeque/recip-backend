const { db_url, port } = require("./config");

const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

const CustomError = require("./models/CustomError");

const recipesRoutes = require("./routes/recipes-routes");
const categoriesRoutes = require("./routes/categories-routes");

app.use(express.json());

// manage cors before deploy
app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: "*",
    preflightContinue: true,
  })
);

// manage authentication
// manage post recipe
// create user
// login

app.use("/categories", categoriesRoutes);
app.use("/recipes", recipesRoutes);

app.use((req, res, next) => {
  throw new CustomError("could not find the route", 404);
});

app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ error: error.message || "an unknown error ocurred" });
});

mongoose
  .connect(db_url)
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.log("could not connect to db");
  });

app.listen(port, () => console.log("listening on asigned port"));
