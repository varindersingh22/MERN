import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";

export default class AddActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addActivity: false,
    };
    this.activity = {};
    this.fields = {};

    this.token = localStorage.getItem("authToken");
  }

  readValue(event, property) {
    this.activity[property] = event.target.value;
    this.fields[property] = event.target;
  }

  add() {
    fetch(url.BASE_URL + url.ACTIVITY_URL + "create", {
      method: "POST",
      body: JSON.stringify(this.activity),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        this.setState({ addActivity: true });
        this.fields.name.value = "";
        this.fields.met.value = "";
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
          <h3 className="col-md-3">Add Activity</h3>

          <Link
            to="/dashboard/activities"
            className="btn btn-primary col-md-2 offset-7"
          >
            View Activities
          </Link>
        </div>

        {this.state.addActivity === true ? (
          <div className="alert alert-success">Activity Created</div>
        ) : null}

        <div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Activity Name"
              onKeyUp={(event) => {
                this.readValue(event, "name");
              }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Activity MET"
              onKeyUp={(event) => {
                this.readValue(event, "met");
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
