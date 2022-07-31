const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { checkAuth } = require("../middlewares/check-auth");

const {
  signup,
  login,
  deleteUser,
} = require("../controllers/user-controllers");

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5, max: 15 }),
  ],
  signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5, max: 15 }),
  ],
  login
);

router.use(checkAuth);

router.delete(
  "/delete",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5, max: 15 }),
  ],
  deleteUser
);

module.exports = router;
