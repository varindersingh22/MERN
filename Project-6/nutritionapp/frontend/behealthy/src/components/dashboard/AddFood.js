import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";

export default class AddFood extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addFood: false,
    };
    this.food = {};
    this.fields = {};

    this.token = localStorage.getItem("authToken");
  }

  readValue(event, property) {
    this.food[property] = event.target.value;
    this.fields[property] = event.target;
  }

  add() {
    fetch(url.BASE_URL + url.FOOD_URL + "create", {
      method: "POST",
      body: JSON.stringify(this.food),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 1) {
          this.setState({ addFood: true });
        }

        var keys = Object.keys(this.fields);
        keys.forEach((key) => {
          this.fields[key].value = "";
        });
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
          <h3 className="col-md-3">Add Food</h3>

          <Link
            to="/dashboard/foods"
            className="btn btn-primary col-md-2 offset-7"
          >
            View Foods
          </Link>
        </div>

        {this.state.addFood === true ? (
          <div className="alert alert-success">Food Created</div>
        ) : null}

        <div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Food Name"
              onKeyUp={(event) => {
                this.readValue(event, "name");
              }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Weight"
              onKeyUp={(event) => {
                this.readValue(event, "weight");
              }}
            />
          </div>

          <div className="form-group">
            <input
              className="form-control"
              placeholder="Unit"
              onKeyUp={(event) => {
                this.readValue(event, "unit");
              }}
            />
          </div>

          <div className="form-group">
            <input
              className="form-control"
              placeholder="Calories"
              onKeyUp={(event) => {
                this.readValue(event, "calories");
              }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Protein"
              onKeyUp={(event) => {
                this.readValue(event, "protein");
              }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Carbs"
              onKeyUp={(event) => {
                this.readValue(event, "carb");
              }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Fat"
              onKeyUp={(event) => {
                this.readValue(event, "fat");
              }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Fibre"
              onKeyUp={(event) => {
                this.readValue(event, "fibre");
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
