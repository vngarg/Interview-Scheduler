const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyAdminJWTToken(req, res, next) {
  const header = req.headers["authorization"];

  // If no header is sent, this means the admin is not logged in.
  if (!header) {
    return res.status(401).json({
      data: [],
      message: "Unauthorized",
    });
  }

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
    if (err || data.role !== "admin") {
      return res.status(401).json({
        data: [],
        message: "Unautorized",
      });
    }

    req.user = data;
    next();
  });
}

module.exports = {
  verifyAdminJWTToken,
};
