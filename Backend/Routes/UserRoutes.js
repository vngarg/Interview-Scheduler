const { verifyAdminJWTToken } = require("../_middlewares/Role-Authorization");
const express = require("express");
const router = express.Router();
const userModel = require("../Models/UserModel");

// Fetch all the users. It is an authenticated API & only Admins have access to it.
router.get("/getAllUsers", verifyAdminJWTToken, async (req, res) => {
  const users = await userModel.find();

  return res.status(200).json({
    data: users,
    message: "Users found.",
  });
});

// fetch a single user from their _id
router.get("/getUser", verifyAdminJWTToken, async (req, res) => {
  const _id = req.query._id;
  const user = await userModel.findOne({ _id });

  if (user)
    return res.status(200).json({
      data: user,
      message: "User Found",
    });
  else
    return res.status(400).json({
      data: [],
      message: "Invalid userId",
    });
});

module.exports = router;
