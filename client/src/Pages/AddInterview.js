import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SubHeading from "../Components/SubHeading";
import { withRouter, useHistory } from "react-router-dom";
import InputField from "../Components/InputField";
import { Form, InputGroup, Card, Button, Alert } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import { API_URL } from "../Config/config";

const AddInterview = (props) => {
  const history = useHistory();
  const [error, setError] = useState();
  const [title, setTitle] = useState("");
  const [startTime, setstartTime] = useState(new Date());
  const [endTime, setendTime] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const [activeMembers, setActiveMembers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) return res.json();
        else if (res.status === 404 || res.status === 400) {
          alert("No user.");
          throw Error("No user.");
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
        setParticipants(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const validate = () => {
    setError("");

    if (!startTime || !endTime) {
      setError("Time is required");
      return false;
    } else if (title.length === 0) {
      setError("Title cannot be empty");
      return false;
    } else if (activeMembers.length < 2) {
      setError("Atleast 2 people must be there in the meeting.");
      return false;
    }

    return true;
  };

  const upadteMembers = (email) => {
    setParticipants(
      participants.filter(function (item) {
        return item.email !== email;
      })
    );

    var x = activeMembers.concat(
      participants.filter(function (item) {
        return item.email === email;
      })
    );

    setActiveMembers(x);
  };

  const getMembers = () => {
    return participants.map((participant, index) => (
      <option value={participant.email} key={index}>
        {participant.fullName}
      </option>
    ));
  };

  const submit = () => {
    if (validate()) {
      const data = {
        title,
        startTime,
        endTime,
        participants: activeMembers,
      };

      fetch(`${API_URL}/interview/newInterview`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) return res.json();
          else if (res.status === 404 || res.status === 400) {
            setError("Invalid Data. Please recheck.");
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
        .then((resoponse) => {
          alert("Interview created.");
          history.push("/home");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <Header />
      <SubHeading subHeading="Schedule a new Interview" />
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

          <select
            className="m-4"
            onChange={(e) => upadteMembers(e.target.value)}
          >
            {getMembers()}
          </select>

          <div className="d-flex direction-row flex-wrap">
            {activeMembers.map((member, index) => {
              return (
                <Card className="m-3 shadow-lg" key={index}>
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

          <Button variant="primary" onClick={submit} className="m-4">
            Schedule
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default withRouter(AddInterview);
