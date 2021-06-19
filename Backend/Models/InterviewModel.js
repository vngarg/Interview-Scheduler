const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
  timestamps: {
    createdAt: "created_at",
  },
};

const schema = new Schema(
  {
    title: {
      type: String
    },
    interviewId: {
      type: String,
      unique: true
    },
    startTime: {
      type: Date,
      requred: true
    },
    endTime: {
      type: Date,
      required: true
    },
    participants: {
      type: [Schema.Types.ObjectId],
      index: true,
      ref: 'user'
    },
    resume: {
      type: String
    }
  },
  options
);

const eventModel = mongoose.model("interviews", schema);
module.exports = eventModel;
