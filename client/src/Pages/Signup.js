import React, { useState } from "react";
import Header from "../Components/Header";
import { Form, Button, Alert } from "react-bootstrap";
import SubHeading from "../Components/SubHeading";
import InputField from "../Components/InputField";
import Touchable from "../Components/Touchable";
import { useHistory } from "react-router-dom";
import { API_URL } from "../Config/config";
import CustomAlert from "../Components/CustomAlert";

const Signup = () => {
  const history = useHistory();

  const [fullName, setfullName] = useState("");
  const [contactNumber, setcontactNumber] = useState("");
  const [college, setCollege] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState();

  // validating the data.
  const validate = () => {
    setError("");
    var exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (fullName.length === 0) {
      setError("Name is required.");
      return false;
    } else if (!exp.test(email)) {
      setError("Invalid Email");
      return false;
    } else if (password.length === 0) {
      setError("Password is required.");
      return false;
    } else if (confirmPassword.length === 0) {
      setError("Confirm the Passwords");
      return false;
    } else if (contactNumber.length !== 10) {
      setError("Invalid Contact Number");
      return false;
    } else if (password !== confirmPassword) {
      setError("Password's don't match.");
      return false;
    } else if (college.length === 0) {
      setError("Enter your College Name.");
      return false;
    }

    return true;
  };

  // Submit the Form
  const submitForm = () => {
    const data = { fullName, college, role, contactNumber, email, password };

    if (validate()) {
      fetch(`${API_URL}/authentication/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) return res.json();
          else if (res.status === 404 || res.status === 400) {
            setError("Some values are missing. Please fill carefully.");
            throw Error("Some values are missing. Please fill carefully.");
          } else if (res.status === 422) {
            setError("User already registered. Please Login.");
            throw Error("User already registered. Please Login.");
          } else {
            throw Error("Error");
          }
        })
        .then((response) => {
          <CustomAlert
            title="Your account has been created."
            message="Please Login."
            label="Ok"
            onClick={() => history.push("/login")}
          />;
          history.push("/login");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <Header />
      <SubHeading subHeading="Signup" />
      <div className="d-flex align-items-center flex-column text-center mt-5">
        <Form className="w-50">
          <InputField
            type="text"
            placeholder="Enter Full Name"
            onChange={(e) => setfullName(e.target.value)}
            text="FullName"
          />
          <InputField
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            text="Email"
          />
          <InputField
            type="password"
            placeholder="Enter password"
            onChange={(e) => setpassword(e.target.value)}
            text="Password"
          />
          <InputField
            type="password"
            placeholder="Enter password"
            onChange={(e) => setconfirmPassword(e.target.value)}
            text="Confirm Pasword"
          />
          <InputField
            type="number"
            placeholder="Enter Contact Number"
            onChange={(e) => setcontactNumber(e.target.value)}
            text="Mobile No."
          />
          <InputField
            type="text"
            placeholder="Enter your College Name"
            onChange={(e) => setCollege(e.target.value)}
            text="College"
          />
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Button variant="primary" onClick={submitForm}>
            Submit
          </Button>
        </Form>
        <div className="m-2">
          Already have an account? &nbsp;
          <Touchable text="Login" onTouch={() => history.push("/login")} />
        </div>
      </div>
    </div>
  );
};

export default Signup;
