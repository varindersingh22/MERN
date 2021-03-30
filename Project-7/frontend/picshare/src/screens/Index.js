import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index/index.css";
import {
  faUserCircle,
  faHome,
  faSearch,
  faSignOutAlt,
  faComments,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Switch, Route, Link } from "react-router-dom";
import Profile from "./index/Profile";
import Search from "./index/Search";
import CreateFeed from "./index/CreateFeed";
import Home from "./index/Home";
import Chat from "./index/Chat";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.username = localStorage.getItem("userName");
    this.state = {};
  }

  logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authStatus");
    localStorage.removeItem("userID");
    this.props.history.replace("/login");
  };

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand " style={{ color: "blue" }} href="#">
            <Link
                    to="/index">
              <h2 style={{ color: "white" }}>Pic Share</h2>
              </Link>
            </a>
            
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
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link
                    to="/index"
                    className="nav-link active"
                    aria-current="page"
                  >
                    <FontAwesomeIcon icon={faHome} style={{color:"white"}}/>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/index/create" className="nav-link">
                    <FontAwesomeIcon icon={faPlusSquare} style={{color:"white"}}/>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/index/search" className="nav-link">
                    <FontAwesomeIcon icon={faSearch} style={{color:"white"}} />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/index/chat" className="nav-link">
                    <FontAwesomeIcon icon={faComments} style={{color:"white"}} />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to={"/index/profile/" + this.username}
                    className="nav-link"
                  >
                    <FontAwesomeIcon icon={faUserCircle} style={{color:"white"}} />
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      this.logout();
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} style={{color:"white"}} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Switch>
          <Route path="/index" exact component={Home} />
          <Route path="/index/profile/:username" exact component={Profile} />
          <Route path="/index/search" exact component={Search} />
          <Route path="/index/create" exact component={CreateFeed} />
          <Route path="/index/chat" exact component={Chat} />
        </Switch>
      </div>
    );
  }
}
