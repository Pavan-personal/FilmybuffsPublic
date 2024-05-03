const jwt = require("jsonwebtoken");
require("dotenv").config("../.env");

const generateJWT = async (user) => {
  return jwt.sign(
    {
      userID: user.userID,
    },
    process.env.SECRET_KEY,
    { expiresIn: "340000s" }
  );
};

module.exports = {
  generateJWT,
};
