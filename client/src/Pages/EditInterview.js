import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeading from "../Components/SubHeading";
import { withRouter, useHistory } from "react-router-dom";
import InputField from "../Components/InputField";
import { Form, InputGroup, Card, Button, Alert } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { API_URL } from "../Config/config";

const EditInterview = (props) => {
  const history = useHistory();
  const [error, setError] = useState();
  const [title, setTitle] = useState(props.location.state.meeting.title);
  const [startTime, setstartTime] = useState(props.location.state.meeting.startTime);
  const [endTime, setendTime] = useState(props.location.state.meeting.endTime);
  const [participants, setParticipants] = useState(
    props.location.state.meeting.participants
  );
  const [members, setmembers] = useState([]);

  useEffect(() => {
    participants.map((participant) => {
      fetch(`${API_URL}/users/getUser?_id=${participant}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) return res.json();
          else if (res.status === 404 || res.status === 400) {
            alert("User not found");
            throw Error("User not found");
          } else if (res.status === 401) {
            alert(
              "You are not authorized to perform this action. Please Login again."
            );
            throw Error("Unauthorized");
          } else {
            throw Error("Error");
          }
        })
        .then((response) => {
          setmembers([...members, response.data]);
        })
        .catch((error) => console.log(error));
    });
  }, []);

  const validate = () => {
    setError("");

    if (!startTime || !endTime) {
      setError("Time is required");
      return false;
    } else if (title.length === 0) {
      setError("Title cannot be empty");
      return false;
    }

    return true;
  };

  const updateInterview = () => {
    if (validate()) {
      fetch(
        `${API_URL}/interview/updateInterview?title=${title}&startTime=${startTime}&endTime=${endTime}&participants[]=${participants}&interviewId=${props.location.state.meeting.interviewId}&_id=${props.location.state.meeting._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => {
          if (res.status === 200 || res.status === 201) return res.json();
          else if (res.status === 404 || res.status === 400) {
            setError("Invalid Data");
            throw Error("Invalid Data.");
          } else if (res.status === 401) {
            setError(
              "You are not authorized to perform this action. Please Login again."
            );
            throw Error("Unauthorized");
          } else {
            throw Error("Error");
          }
        })
        .then((response) => {
          alert("Interview updated");
          history.push("/home");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <Header />
      <SubHeading subHeading="Edit the Interview" />
      <div className="d-flex align-items-center flex-column text-center mt-5">
        <Form className="w-50">
          <InputField
            type="text"
            placeholder="Title of the Interview"
            onChange={(e) => setTitle(e.target.value)}
            text="Title"
            value={title}
          />
          <Form.Group>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>Start Time</InputGroup.Text>
              </InputGroup.Prepend>
              <DateTimePicker
                onChange={(e) => setstartTime(e)}
                value={startTime}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>End Time</InputGroup.Text>
              </InputGroup.Prepend>
              <DateTimePicker onChange={(e) => setendTime(e)} value={endTime} />
            </InputGroup>
          </Form.Group>

          <div className="d-flex direction-row flex-wrap">
            {members.map((member) => {
              return (
                <Card className="m-3 shadow-lg">
                  <Card.Header>{member.fullName}</Card.Header>
                  <Card.Body>
                    <Card.Text>{member.email}</Card.Text>
                    <Card.Text>{member.contactNumber}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Button variant="primary" onClick={updateInterview}>
            Update
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default withRouter(EditInterview);
