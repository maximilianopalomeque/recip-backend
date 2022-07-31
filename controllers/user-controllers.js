const CustomError = require("../models/CustomError");
const User = require("../models/userSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { token_secret } = require("../config");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("invalid credentials, can't sign up", 401));
  }

  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return next(new CustomError("email already used", 500));
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return next(new CustomError("username already used", 500));
    }
  } catch (error) {
    return next(new CustomError("something went wrong, can't sign up", 500));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new CustomError("could not create user, failed to process password", 500)
    );
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    userRecipes: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new CustomError("could not save user to db", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { username: newUser.username, email: newUser.email },
      token_secret,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    return next(
      new CustomError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(201).json({
    message: "user created",
    username: newUser.username,
    email: newUser.email,
    token: token,
    recipes: newUser.userRecipes,
  });
};

// -------

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("invalid credentials, can't sign up", 401));
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).orFail();
  } catch (error) {
    return next(
      new CustomError("user does not exists, check your credentials", 500)
    );
  }

  try {
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return next(new CustomError("incorrect password", 500));
    }
  } catch (error) {
    return next(new CustomError("failed to compare passwords", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { username: existingUser.username, email: existingUser.email },
      token_secret,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    return next(
      new CustomError("Invalid credentials, could not log you in.", 401)
    );
  }

  res.json({
    message: "logged in",
    username: existingUser.username,
    email: existingUser.email,
    token: token,
    recipes: existingUser.userRecipes,
  });
};

const deleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("invalid credentials, can't delete user", 401));
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).orFail();
  } catch (error) {
    return next(
      new CustomError("user does not exists, check your credentials", 500)
    );
  }

  try {
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return next(new CustomError("incorrect password", 500));
    }
  } catch (error) {
    return next(new CustomError("failed to compare passwords", 500));
  }

  try {
    await User.findOneAndDelete({ email: email });
  } catch (error) {
    return next(new CustomError("could not delete user", 500));
  }

  res.json("user deleted");
};

exports.signup = signup;
exports.login = login;
exports.deleteUser = deleteUser;
