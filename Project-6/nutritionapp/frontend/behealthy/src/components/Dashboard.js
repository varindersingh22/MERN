import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";

import Activities from "./dashboard/Activities";
import AddActivity from "./dashboard/AddActivity";
import Foods from "./dashboard/Foods";
import AddFood from "./dashboard/AddFood";
import Users from "./dashboard/Users";
import AddUser from "./dashboard/AddUser";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authStatus");
    localStorage.removeItem("userID");
    localStorage.removeItem("userWeight");
    this.props.history.replace("/login");
  }

  changeHighlight(event) {
    event.target.classList.add("active");
  }

  render() {
    return (
      <div className="container" style={{ marginTop: "20px" }}>
        {/* navigation  */}

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/dashboard/activities" className="navbar-brand">
              Dashboard
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/dashboard/activities"
                    onClick={(event) => {
                      this.changeHighlight(event);
                    }}
                  >
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard/foods"
                    onClick={(event) => {
                      this.changeHighlight(event);
                    }}
                  >
                    Food Items
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard/users"
                    onClick={(event) => {
                      this.changeHighlight(event);
                    }}
                  >
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      this.logout();
                    }}
                  >
                    Logout
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Switch>
          <Route path="/dashboard" exact component={Activities} />

          <Route path="/dashboard/activities" exact component={Activities} />
          <Route
            path="/dashboard/activities/create"
            exact
            component={AddActivity}
          />

          <Route path="/dashboard/foods" exact component={Foods} />
          <Route path="/dashboard/foods/create" exact component={AddFood} />

          <Route path="/dashboard/users" exact component={Users} />
          <Route path="/dashboard/users/create" exact component={AddUser} />
        </Switch>
      </div>
    );
  }
}
