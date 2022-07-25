const CustomError = require("../models/CustomError");
const jwt = require("jsonwebtoken");
const { token_secret } = require("../config");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error();
    }

    jwt.verify(token, token_secret);
    next();
  } catch (error) {
    return next(new CustomError("Authentication failed", 401));
  }
};

exports.checkAuth = checkAuth;
