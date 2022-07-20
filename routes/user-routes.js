const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signup, login } = require("../controllers/user-controllers");

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5, max: 10 }),
  ],
  signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5, max: 10 }),
  ],
  login
);

module.exports = router;
