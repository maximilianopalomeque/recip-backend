const express = require("express");
const router = express.Router();
const categoriesControllers = require("../controllers/categories-controller");

router.get("/", categoriesControllers.getAllCategories);

module.exports = router;
