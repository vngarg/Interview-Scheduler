const { verifyAdminJWTToken } = require("../_middlewares/Role-Authorization");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const userModel = require("../Models/UserModel");
const interviewModel = require("../Models/InterviewModel");

// create a new Interview
router.post("/newInterview", verifyAdminJWTToken, async (req, res) => {
  const { startTime, endTime, participants, title } = req.body;
  const interviewId = uuidv4();

  if (!participants || !startTime || !endTime || !title) {
    return res.status(400).json({
      data: [],
      message: "Some parameters are missing",
    });
  } 
  // else if (compareDates(Date(startTime), Date(endTime))) {
  //   return res.status(400).json({
  //     data: [],
  //     message: "Invalid Meeting time",
  //   });
  // } 
  else if (participants.length === 0) {
    return res.status(400).json({
      data: [],
      message: "Select the participants for the meeting.",
    });
  }

  var overlap = await checkOverLappingTime(participants, startTime, endTime);
  if (overlap) {
    return res.status(400).json({
      data: [],
      message: "User has a meeting during this time.",
    });
  }

  // create a new interview.
  const interviewDetails = {
    startTime,
    endTime,
    interviewId,
  };

  // updating the user & adding the meeting details to all the participants.
  participants.map(async (participant) => {
    await userModel.findOneAndUpdate(
      { _id: participant },
      { $push: { meeting: interviewDetails } }
    );
  });

  user = new interviewModel({
    startTime,
    endTime,
    participants,
    interviewId,
    title
  });
  await user.save();

  return res.status(200).json({
    data: [],
    message: "Interview Created",
  });
});

// Get all the interviews
router.get("/getAllInterviews", verifyAdminJWTToken, async (req, res) => {
  const interviews = await interviewModel.find();

  return res.status(200).json({
    data: interviews,
    message: "Interviews found.",
  });
});

// Update an Interview
router.patch("/updateInterview", verifyAdminJWTToken, async (req, res) => {
  const { _id, startTime, endTime, interviewId, title } = req.query;
  
  if (!startTime || !endTime || !interviewId || !title) {
    return res.status(400).json({
      data: [],
      message: "Some parameters are missing.",
    });
  } 
  // else if (startTime >= endTime) {
  //   return res.status(400).json({
  //     data: [],
  //     message: "Invalid Meeting time",
  //   });
  // }

  const interview = await interviewModel.findOne({ _id });

  if (!interview) {
    return res.status(400).json({
      data: [],
      message: "No interview Found",
    });
  }

  // Deleting the meeting with the same interviewId from each participant.
  await interview.participants.map(async (participant) => {
    var user = await userModel.findOne({ _id: participant });

    user.meeting = user.meeting.filter(function (value) {
      return value.interviewId != interviewId;
    });

    await userModel.findOneAndUpdate(
      { _id: participant },
      { meeting: user.meeting }
    );
  });

  var meetingDetails = {
    interviewId,
    startTime,
    endTime,
  };
  await interview.participants.map(async (participant) => {
    const x = await userModel.findOneAndUpdate(
      { _id: participant },
      { $push: { meeting: meetingDetails } }
    );
  });

  await interviewModel.findOneAndUpdate(
    { _id },
    { startTime, endTime, title }
  );
  return res.status(200).json({
    data: [],
    message: "Interview updated successfully.",
  });
});

// Delete an interview
router.delete("/deleteInterview", verifyAdminJWTToken, async (req, res) => {
  const { _id, interviewId, participants } = req.query;
  if (!interviewId || !participants) {
    return res.status(400).json({
      data: [],
      message: "Some parameters are missing.",
    });
  }

  // Deleting interview from the participant.
  await participants.map(async (participant) => {
    const user = await userModel.findOne({ _id: participant });

    user.meeting = user.meeting.filter(function (value) {
      return value.interviewId != interviewId;
    });

    await userModel.findOneAndUpdate(
      { _id: participant },
      { meeting: user.meeting }
    );
  });

  await interviewModel.findOneAndDelete({ _id });
  return res.status(200).json({
    data: [],
    message: "Meeting deleted",
  });
});

const checkOverLappingTime = async (participants, startTime, endTime) => {
  participants.map(async (participant) => {
    const user = await userModel.findOne({ _id: participant });
    var meetings = user.meeting;

    meetings.map((meeting) => {
      if (
        (meeting.startTime >= startTime && meeting.startTime <= endTime) ||
        (meeting.endTime <= endTime && meeting.endTime >= startTime)
      )
        return true;
    });
    return false;
  });
};

const compareDates = (start, end) => {
// return the situation ki start >= end
const timea = start.substr(4,12);
const timeb = end.substr(4, 12);
console.log(timea, timeb, timea < timeb)
console.log(start, end)
return (start >= end)
}

module.exports = router;
