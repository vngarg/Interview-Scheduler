const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateJWTToken = ({
  fullName,
  email,
  role,
}) => {
  return jwt.sign(
    {
      fullName,
      role,
      email
    },
    process.env.JWT_SECRET
  );
};

module.exports = {
    generateJWTToken,
}