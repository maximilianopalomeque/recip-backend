const CustomError = require("../models/CustomError");
const User = require("../models/userSchema");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError("invalid credentials, can't sign up", 401));
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return next(new CustomError("user already exists", 500));
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
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new CustomError("could not save user to db", 500));
  }

  res.json({ message: "user created", username: username, email: email });
};

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

  res.json({ message: "logged in", email: email });
};

exports.signup = signup;
exports.login = login;
