const crypto = require("crypto");

const generateTokenSecret = () => {
  const tokenSecret = crypto.randomBytes(64).toString("hex");
  console.log(tokenSecret);
};

generateToken();
