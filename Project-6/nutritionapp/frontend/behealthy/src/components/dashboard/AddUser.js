import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";

export default class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUser: false,
    };
    this.user = { approved: false };
    this.fields = {};

    this.token = localStorage.getItem("authToken");
  }

  readValue(event, property) {
    this.user[property] = event.target.value;
    this.fields[property] = event.target;
  }

  add() {
    fetch(url.BASE_URL + url.REGISTRATION_URL, {
      method: "POST",
      body: JSON.stringify(this.user),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 1) {
          this.setState({ addUser: true });

          let keys = Object.keys(this.fields);
          keys.forEach((key) => {
            this.fields[key].value = "";
          });

          if (this.checkbox !== undefined) {
            this.checkbox.checked = false;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <div
          className="row"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <h3 className="col-md-3">Add User</h3>

          <Link
            to="/dashboard/users"
            className="btn btn-primary col-md-2 offset-7"
          >
            View Users
          </Link>
        </div>

        {this.state.addUser === true ? (
          <div className="alert alert-success">User Created</div>
        ) : null}

        <div>
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
              type="password"
              onKeyUp={(event) => {
                this.readValue(event, "password");
              }}
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              onKeyUp={(event) => {
                this.readValue(event, "country");
              }}
              className="form-control"
              placeholder="Country"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              onKeyUp={(event) => {
                this.readValue(event, "age");
              }}
              className="form-control"
              placeholder="Age"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              onKeyUp={(event) => {
                this.readValue(event, "weight");
              }}
              className="form-control"
              placeholder="Weight"
            />
          </div>

          <div className="form-group">
            <select
              onChange={(event) => {
                this.readValue(event, "role");
              }}
              className="form-control"
            >
              <option value="">Select Role</option>
              <option value="customer">Customer</option>
              <option value="master">Master</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "bold", marginRight: "20px" }}>
              Approved
            </label>
            <input
              type="checkbox"
              onChange={(event) => {
                this.user.approved = event.target.checked;
                this.checkbox = event.target;
              }}
            />
          </div>

          <div className="form-group">
            <button
              className="btn btn-primary"
              onClick={() => {
                this.add();
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  }
}
