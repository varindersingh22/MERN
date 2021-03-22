import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };

    this.token = localStorage.getItem("authToken");
  }

  approval(index) {
    let tempUsers = this.state.users;
    let tempUser = tempUsers[index];
    let id = tempUser._id;
    tempUser.approved = !tempUser.approved;

    fetch(url.BASE_URL + url.USER_URL + "update/" + id, {
      method: "PUT",
      body: JSON.stringify(tempUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 1) {
          console.log("updated");
          tempUsers[index] = tempUser;
          this.setState({ users: tempUsers });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount = () => {
    fetch(url.BASE_URL + url.USER_URL, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ users: data.users });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        <div
          className="row"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <h3 className="col-md-3">Users</h3>

          <Link
            to="/dashboard/users/create"
            className="btn btn-primary col-md-2 offset-7"
          >
            Add User
          </Link>
        </div>

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Country</th>
              <th>Age</th>
              <th>Role</th>
              <th>Email</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.weight}</td>
                  <td>{user.country}</td>
                  <td>{user.age}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.approved === true ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          this.approval(index);
                        }}
                      >
                        Un Approve
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          this.approval(index);
                        }}
                      >
                        Approve
                      </button>
                    )}
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
