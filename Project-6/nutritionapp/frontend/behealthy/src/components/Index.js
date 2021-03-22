import React, { Component } from "react";
import { Switch, Link, Route } from "react-router-dom";
import "./Index.css";
import Food from "./customer/Food";
import Activity from "./customer/Activity";
import FoodHistory from "./customer/FoodHistory";
import ActivityHistory from "./customer/ActivityHistory";

class Index extends Component {
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

  render() {
    return (
      <div className="">
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/index/food">
              BE Healthy
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
                    to="/index/food"
                  >
                    Todays Food
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/index/activity">
                    Todays Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/index/food/history" className="nav-link">
                    Food History
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/index/activity/history" className="nav-link">
                    Activity History
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

        <div style={{ marginTop: "100px" }}>
          <Switch>
            <Route path="/index" exact component={Food} />
            <Route path="/index/food" exact component={Food} />
            <Route path="/index/activity" exact component={Activity} />
            <Route path="/index/food/history" exact component={FoodHistory} />
            <Route
              path="/index/activity/history"
              exact
              component={ActivityHistory}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Index;
