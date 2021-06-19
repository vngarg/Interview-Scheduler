import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import SubHeading from "../Components/SubHeading";
import { API_URL } from "../Config/config";
import Loader from "react-loader";
import { Card, Button } from "react-bootstrap";
import { getDate } from "../Components/GetDate";
import { getTime } from "../Components/GetTime";
import { useHistory } from "react-router-dom";

const Home = (props) => {
  const history = useHistory();
  const [state, setState] = useState({
    role: localStorage.getItem("role"),
    loading: true,
    meetings: [],
  });

  const getMeetings = () => {
    fetch(`${API_URL}/interview/getAllInterviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) return res.json();
        else if (res.status === 401) {
          alert("You are not authorized to get the meeting details.");
          throw Error("Unautorized");
        } else {
          alert("Error");
          throw Error("Error");
        }
      })
      .then((response) => {
        setState({
          ...state,
          loading: false,
          meetings: response.data,
        });
      })
      .catch((error) => {
        setState({
          ...state,
          loading: false,
        });
        console.log(error);
      });
  };

  useEffect(() => {
    if (state.role === "admin") getMeetings();
  }, []);

  const deleteInterview = (interview) => {
    const data = {
      _id: interview._id,
      interviewId: interview.interviewId,
      participants: interview.participants,
    };

    fetch(
      `${API_URL}/interview/deleteInterview?_id=${interview._id}&interviewId=${interview.interviewId}&participants[]=${interview.participants}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (res.status === 200 || res.status === 201) return res.json();
        else if (res.status === 401) {
          alert(
            "You are not authorized to delete the meeting. Try Logging In again."
          );
          throw Error("Unautorized");
        } else {
          alert("Error");
          throw Error("Error");
        }
      })
      .then((response) => {
        alert("Interview Deleted.");
        getMeetings();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Header />
      {state.role === "admin" ? (
        state.loading ? (
          <Loader />
        ) : state.meetings.length === 0 ? (
          <div className="text-center">
            <h2 className="text-center m-5">No meeting Scheduled</h2>
            <Button
              variant="primary"
              onClick={() => history.push("/addInterview")}
            >
              Schedule Meeting
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <SubHeading subHeading="Scheduled Meetings" />
            <Button
              variant="primary"
              onClick={() => history.push("/addInterview")}
            >
              Schedule Meeting
            </Button>
            <div className="d-flex direction-row flex-wrap justify-content-center">
              {state.meetings.map((meeting, index) => (
                <Card className="m-4 shadow-lg" key={index}>
                  <Card.Header>{meeting.title}</Card.Header>
                  <Card.Body>
                    <Card.Title>
                      Participants: {meeting.participants.length}
                    </Card.Title>
                    <Card.Text>
                      {getDate(meeting.startTime)} ({getTime(meeting.startTime)}
                      ) <strong>-</strong> {getDate(meeting.endTime)} (
                      {getTime(meeting.endTime)})
                    </Card.Text>

                    <Button
                      onClick={() =>
                        history.push("/editInterview", { meeting })
                      }
                      variant="primary"
                      className="mr-2"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => deleteInterview(meeting)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )
      ) : (
        <div>Get all the meetings</div>
      )}
    </div>
  );
};

export default Home;
