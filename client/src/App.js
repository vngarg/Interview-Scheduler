import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import EditInterview from "./Pages/EditInterview";
import AddInterview from "./Pages/AddInterview";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path='/home'>
          <Home />
        </Route>
        <Route path='/editInterview'>
          <EditInterview />
        </Route>
        <Route path='/addInterview'>
          <AddInterview />
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
