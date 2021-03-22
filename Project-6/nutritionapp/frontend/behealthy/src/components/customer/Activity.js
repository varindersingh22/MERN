import React, { Component } from "react";

import url from "../../Url";

export default class Activity extends Component {
  constructor(props) {
    super(props);

    this.token = localStorage.getItem("authToken");

    this.state = {
      activities: [],
      searchedActivity: [],
      userActivities: [],
      currentActivity: {},
      currentActivtiyCopy: {},
      currentCalories: 0,
      totalCalories: 0,
      disabled: {
        def: true,
        cursor: "not-allowed",
      },
    };
  }

  componentDidMount = () => {
    // to get all food
    fetch(url.BASE_URL + url.ACTIVITY_URL, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ activities: data.activities });
        this.setState({ currentActivity: data.activities[0] });
        this.setState({ currentActivityCopy: data.activities[0] });
      })
      .catch((err) => {
        console.log(err);
      });

    // to get todays activity

    let userID = localStorage.getItem("userID");
    let userWeight = localStorage.getItem("userWeight");

    fetch(
      url.BASE_URL +
        url.USER_URL +
        "useractivity/" +
        userID +
        "/" +
        new Date().toDateString(),
      {
        headers: {
          Authorization: "Bearer " + this.token,
        },
      }
    )
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

  searchActivity = (event) => {
    let userActivity = event.target.value;
    this.searchField = event.target;

    if (userActivity.length !== 0) {
      let tempArray = this.state.activities.filter((activity, index) => {
        return activity.name.toUpperCase().includes(userActivity.toUpperCase());
      });

      this.setState({ searchedActivity: tempArray });
    } else {
      this.setState({ searchedActivity: [] });
    }
  };

  addToRoutine = () => {
    let userActivity = {};

    userActivity.user = localStorage.getItem("userID");
    userActivity.activity = this.state.currentActivity._id;
    userActivity.date = new Date().toDateString();
    userActivity.time = this.timeField.value;

    fetch(url.BASE_URL + url.USER_URL + "useractivity", {
      method: "POST",
      body: JSON.stringify(userActivity),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        // temporray updation
        userActivity.activity = this.state.currentActivity;
        userActivity.burnedCalories = this.state.currentCalories;
        let tempUserActivities = this.state.userActivities;
        tempUserActivities.push(userActivity);

        this.setState({ userActivities: tempUserActivities });

        this.calculateTotal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  selectActivity = (activity) => {
    this.setState({ currentActivity: activity });
    this.setState({ currentActivityCopy: activity });
    this.setState({ searchedActivity: [] });
    if (this.timeField !== undefined) {
      this.timeField.value = "";
    }

    if (this.searchField !== undefined) {
      this.searchField.value = "";
    }

    this.setState({ currentCalories: 0 });
  };

  calculateCalories = (event) => {
    if (Number(event.target.value) > 0) {
      let userWeight = localStorage.getItem("userWeight");
      this.timeField = event.target;
      let time = event.target.value;
      let met = this.state.currentActivity.met;
      let burnedCalories = (userWeight * met * time) / 60;
      this.setState({ currentCalories: burnedCalories });
      this.setState({ disabled: { def: false, cursor: "pointer" } });
    } else {
      this.setState({ disabled: { def: true, cursor: "not-allowed" } });
      this.setState({ currentCalories: 0 });
    }
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
        <div className="row">
          <div
            className="form-group col-12"
            style={{ height: "50px", position: "relative", zIndex: 1 }}
          >
            <input
              type="text"
              className="form-control"
              style={{ height: "50px" }}
              placeholder="Search Activity / Exercise"
              onChange={(event) => {
                this.searchActivity(event);
              }}
            />
            <div className="search-results">
              {this.state.searchedActivity.map((sactivity, index) => {
                return (
                  <div
                    className="result"
                    key={index}
                    onClick={() => {
                      this.selectActivity(sactivity);
                    }}
                  >
                    {sactivity.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div class="col-6">
            <div className="card">
              <div className="card-body total-cal">
                <h1>{this.state.totalCalories.toFixed(3)}</h1>
                <span>Total Calories Burned</span>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {this.state.currentActivity.name}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {this.state.currentCalories.toFixed(2)} Calories Burned
                </h6>

                <div className="card-body">
                  <label>Time in Minutes</label>
                  <input
                    className="form-control"
                    placeholder="0 minutes"
                    type="text"
                    onChange={(event) => {
                      this.calculateCalories(event);
                    }}
                  />
                </div>
                <button
                  disabled={this.state.disabled.def}
                  style={{ cursor: this.state.disabled.cursor }}
                  className="btn btn-primary"
                  onClick={() => {
                    this.addToRoutine();
                  }}
                >
                  ADD TO ROUTINE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5 mb-5">
          <div className="col-12">
            <h2 className="in-title">Todays Activities</h2>
          </div>
          {this.state.userActivities.length === 0 ? (
            <p className="col-md-12">No Activities Yet</p>
          ) : (
            this.state.userActivities.map((useractivity, index) => {
              return (
                <div className="col-6" key={index}>
                  <div className="card mt-2">
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
