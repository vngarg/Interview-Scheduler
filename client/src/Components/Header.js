import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const Header = () => {
  const history = useHistory();
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const Logout = () => {
    localStorage.clear();
    history.push('/login')
    return;
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Interview Scheduler</Navbar.Brand>
      {token ? (
        <Nav className="ml-auto">
          <Nav.Link onClick={Logout}>Logout</Nav.Link>
        </Nav>
      ) : null}
    </Navbar>
  );
};

export default Header;
