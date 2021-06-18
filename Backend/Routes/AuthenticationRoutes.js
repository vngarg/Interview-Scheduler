const express = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../Models/UserModel");
const router = express.Router();
const { generateJWTToken } = require("../_helpers/Functions");

router.post("/login", Login);
router.post("/signup", AdminSignup);

// Login route.
async function Login(req, res) {
  var { email, password } = req.body;

  // If email or password is not sent
  if (!email || !password) {
    return res.status(400).json({
      data: [],
      message: "Email and password are required",
    });
  }
  
  // Validating Email
  if(!validateEmail(email)) {
    return res.status(400).json({
      data: [],
      message: "Invalid Email."
    })
  }

  var user = await userModel.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = generateJWTToken({
      fullName: user.fullName,
      role: user.role,
      email: user.email
    });

    const data = {
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      contactNumber: user.contactNumber,
      jwtToken: token
    };

    return res.status(200).json({
      data,
      message: "Login successful",
    });
  } else {
    return res.status(404).json({
      data: [],
      message: "User not found",
    });
  }
}

// Admin Signup
async function AdminSignup(req, res) {
  var {
    fullName,
    contactNumber,
    email,
    password,
    college,
    role,
  } = req.body;

  // If some parameter is missing
  if (!fullName || !contactNumber || !email || !password) {
    return res.status(400).json({
      data: [],
      message: "Some parameters are missing",
    });
  }

  // Validating Email
  if(!validateEmail(email)) {
    return res.status(400).json({
      data: [],
      message: "Invalid Email."
    })
  }

  //  Invalid contact number
  if (contactNumber.length !== 10) {
    return res.status(400).json({
      data: [],
      message: "Invalid contact number",
    });
  }

  var user = await userModel.find({ contactNumber });
  // user already registered.
  if (user.length !== 0) {
    return res.status(422).json({
      data: [],
      message:
        "User with this contact number is already registered. Please login.",
    });
  }

  user = await userModel.find({ email });
  // user already registered.
  if (user.length !== 0) {
    return res.status(422).json({
      data: [],
      message: "Email already registered. Please user some other email.",
    });
  }

  // Everything is fine. Register a user.
  password = await bcrypt.hashSync(password, 10);
  user = new userModel({
    fullName,
    contactNumber,
    email,
    password,
    role,
    college
  });

  await user.save();
  return res.status(200).json({
    data: user,
    message: "User created successfully.",
  });
}

const validateEmail = email => {
  const exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return exp.test(email);
}

module.exports = router;
