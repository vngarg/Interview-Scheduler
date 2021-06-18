import React, { useState } from "react";
import Header from "../Components/Header";
import { Form, Button, Alert } from "react-bootstrap";
import SubHeading from "../Components/SubHeading";
import InputField from "../Components/InputField";
import Touchable from "../Components/Touchable";
import { useHistory } from "react-router-dom";
import { API_URL } from "../Config/config";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState();

  // validating the data.
  const validate = () => {
    setError("");
    var exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!exp.test(email)) {
      setError("Invalid Email");
      return false;
    } else if (password.length === 0) {
      setError("Password is required.");
      return false;
    }

    return true;
  };

  // Submit the Form
  const submitForm = () => {
    const data = { email, password };

    if (validate()) {
      fetch(`${API_URL}/authentication/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201) return res.json();
          else if (res.status === 404 || res.status === 400) {
            setError("Email or Password are Incorrect.");
            throw Error("Email or Password are Incorrect.");
          } else {
            throw Error("Error");
          }
        })
        .then((response) => {
          localStorage.setItem("token", response.data.jwtToken);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("fullName", response.data.fullName);
          history.push("/home");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <Header />
      <SubHeading subHeading="Login" />
      <div className="d-flex align-items-center flex-column text-center mt-5">
        <Form className="w-50">
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
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Button variant="primary" onClick={submitForm}>
            Submit
          </Button>
        </Form>
        <div className="m-2">
          Don't have an account? &nbsp;
          <Touchable text="Signup" onTouch={() => history.push("/signup")} />
        </div>
      </div>
    </div>
  );
};

export default Login;
