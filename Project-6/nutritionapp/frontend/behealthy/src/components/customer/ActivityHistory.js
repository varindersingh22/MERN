import React, { Component } from "react";

import url from "../../Url";

export default class ActivityHistory extends Component {
  constructor(props) {
    super(props);

    this.token = localStorage.getItem("authToken");

    this.state = {
      userActivities: [],
      totalCalories: 0,
      date: new Date().toDateString(),
    };
  }

  componentDidMount = () => {
    this.getUserActivityOnDate(new Date().toDateString());
  };

  getUserActivityOnDate = (date) => {
    // to get todays activity
    this.setState({ date: date });

    let userID = localStorage.getItem("userID");
    let userWeight = localStorage.getItem("userWeight");

    fetch(url.BASE_URL + url.USER_URL + "useractivity/" + userID + "/" + date, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let tempArray = data.activities.map((userActivity, index) => {
          userActivity.burnedCalories =
            (userWeight * userActivity.activity.met * userActivity.time) / 60;

          return userActivity;
        });

        this.setState({ userActivities: tempArray });
        this.calculateTotal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  calculateTotal = () => {
    let totalCalories = 0;
    this.state.userActivities.forEach((userActivity, index) => {
      totalCalories += userActivity.burnedCalories;
    });

    this.setState({ totalCalories: totalCalories });
  };

  render() {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <div className="form-group row">
          <input
            type="date"
            style={{ height: "50px" }}
            className="form-control"
            onChange={(event) => {
              this.getUserActivityOnDate(
                new Date(event.target.value).toDateString()
              );
            }}
          />
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body total-cal">
                <h1>{this.state.totalCalories.toFixed(3)}</h1>
                <span>Total Calories Burned</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 mb-5">
          <div className="col-12">
            <h2 className="in-title">{this.state.date} Activities</h2>
          </div>
          {this.state.userActivities.length === 0 ? (
            <p className="col-md-12">No Activities Yet</p>
          ) : (
            this.state.userActivities.map((useractivity, index) => {
              return (
                <div className="col-6">
                  <div className="card mt-2" key={index}>
                    <div className="card-body">
                      <h5 className="card-title">
                        {useractivity.activity.name}
                      </h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {useractivity.burnedCalories.toFixed(2)} Calories Burned
                        ({useractivity.time} minutes )
                      </h6>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
}
