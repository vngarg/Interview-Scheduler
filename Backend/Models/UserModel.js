const mongoose = require("mongoose");
const Enums = require("../_helpers/enums");
const Schema = mongoose.Schema;

// timestamps
const options = {
  timestamps: {
    createdAt: "created_at",
  },
};

const schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    college: {
      type: String
    },
    contactNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [Enums.role.ADMIN, Enums.role.USER],
      default: Enums.role.USER
    },
    meeting: [
      {
        interviewId: {
          type: String,
          required: true
        },
        startTime: {
          type: Date,
          required: true
        },
        endTime: {
          type: Date,
          required: true
        }
      },
    ],
  },
  options
);

const userModel = mongoose.model("user", schema);
module.exports = userModel;
