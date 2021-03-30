import React, { Component } from "react";
import url from "../Url";
import { Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regConf: false,
    };
    this.user = {};
    this.fields = {};
  }

  hideRegMessage() {
    this.setState({ regConf: false });
  }

  readValue(event, keyName) {
    this.user[keyName] = event.target.value;
    this.fields[keyName] = event.target;
  }

  registerUser() {
    fetch(url.BASE_URL + url.REGISTRATION_URL, {
      method: "POST",
      body: JSON.stringify(this.user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((message) => {
        this.user = {};

        this.setState({ regConf: true });

        this.fields.name.value = "";
        this.fields.email.value = "";
        this.fields.password.value = "";
        this.fields.username.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div
        className="container card"
        style={{ marginTop: "50px", paddingTop: "20px" }}
      >
        <h2 className="in-title">Register</h2>

        {this.state.regConf === true ? (
          <div
            style={{ marginTop: "20px" }}
            className="alert alert-success"
            onClick={() => {
              this.hideRegMessage();
            }}
          >
            User Registered
          </div>
        ) : null}

        <div style={{ marginTop: "10px" }}>
          <div className="form-group">
            <input
              type="text"
              onKeyUp={(event) => {
                this.readValue(event, "name");
              }}
              className="form-control"
              placeholder="Name"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              onKeyUp={(event) => {
                this.readValue(event, "email");
              }}
              className="form-control"
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              onKeyUp={(event) => {
                this.readValue(event, "username");
              }}
              className="form-control"
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              onKeyUp={(event) => {
                this.readValue(event, "password");
              }}
              className="form-control"
              placeholder="Password"
            />
          </div>

          <div className="form-group col-12 row">
            <button
              className="btn btn-primary mr-3"
              onClick={() => {
                this.registerUser();
              }}
            >
              Register
            </button>

            <Link to="/login" className="nav-link">
              Already Registered? Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
