import React, { Component } from "react";
import { Link } from "react-router-dom";
import url from "../../Url";

export default class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      updateModal: false,
    };

    this.activity = {};
    this.token = localStorage.getItem("authToken");
  }

  delete = (id, index) => {
    fetch(url.BASE_URL + url.ACTIVITY_URL + "delete/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 1) {
          let tempActivities = this.state.activities;
          tempActivities.splice(index, 1);
          this.setState({ activities: tempActivities });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    fetch(url.BASE_URL + url.ACTIVITY_URL, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ activities: data.activities });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  openModal = () => {
    this.setState({ updateModal: true });
  };

  closeModal = () => {
    this.setState({ updateModal: false });
  };

  setValuesForUpdate = (index) => {
    this.activity = this.state.activities[index];
  };

  readValue(event, property) {
    this.activity[property] = event.target.value;
  }

  update() {
    let id = this.activity._id;
    console.log(JSON.stringify(this.activity));
    fetch(url.BASE_URL + url.ACTIVITY_URL + "update/" + id, {
      method: "PUT",
      body: JSON.stringify(this.activity),
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 1) {
          console.log("updated");
          this.closeModal();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        {/* modal */}
        {this.state.updateModal === true ? (
          <div
            className="modal-dialog"
            style={{
              top: "100px",
              left: "30%",
              zIndex: 100,
              width: "50%",
              position: "fixed",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Update Activity
                </h5>
              </div>
              <div className="modal-body">
                <div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Activity Name"
                      defaultValue={this.activity.name}
                      onChange={(event) => {
                        this.readValue(event, "name");
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Activity MET"
                      defaultValue={this.activity.met}
                      onChange={(event) => {
                        this.readValue(event, "met");
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    this.closeModal();
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    this.update();
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <div
          className="row"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <h3 className="col-md-3">Activities</h3>

          <Link
            to="/dashboard/activities/create"
            className="btn btn-primary col-md-2 offset-7"
          >
            Add Activity
          </Link>
        </div>

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>MET value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.activities.map((activity, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{activity.name}</td>
                  <td>{activity.met}</td>
                  <td>
                    <button
                      className="btn btn-success mr-2"
                      onClick={() => {
                        this.openModal();
                        this.setValuesForUpdate(index);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        this.delete(activity._id, index);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
