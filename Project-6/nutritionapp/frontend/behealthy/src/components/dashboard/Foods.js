import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";

export default class Foods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: [],
      updateModal: false,
    };

    this.token = localStorage.getItem("authToken");
  }

  openModal = () => {
    this.setState({ updateModal: true });
  };

  closeModal = () => {
    this.setState({ updateModal: false });
  };

  setValuesForUpdate = (index) => {
    this.food = this.state.foods[index];
  };

  readValue(event, property) {
    this.food[property] = event.target.value;
  }

  delete = (id, index) => {
    fetch(url.BASE_URL + url.FOOD_URL + "delete/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 1) {
          let tempFoods = this.state.foods;
          tempFoods.splice(index, 1);
          this.setState({ foods: tempFoods });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  update() {
    let id = this.food._id;
    console.log(JSON.stringify(this.food));
    fetch(url.BASE_URL + url.FOOD_URL + "update/" + id, {
      method: "PUT",
      body: JSON.stringify(this.food),
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

  componentDidMount = () => {
    fetch(url.BASE_URL + url.FOOD_URL, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ foods: data.foods });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div style={{ marginTop: "20px" }}>
        {/* modal */}

        {this.state.updateModal === true ? (
          <div
            className="modal-dialog"
            style={{
              top: "0px",
              left: "30%",
              zIndex: 100,
              width: "50%",
              position: "fixed",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Update Food
                </h5>
              </div>
              <div className="modal-body">
                <div>
                  <div className="form-group">
                    {/* <label style={{ fontWeight: "bold" }}>Name</label> */}
                    <input
                      className="form-control"
                      placeholder="Food Name"
                      defaultValue={this.food.name}
                      onKeyUp={(event) => {
                        this.readValue(event, "name");
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Weight"
                      defaultValue={this.food.weight}
                      onKeyUp={(event) => {
                        this.readValue(event, "weight");
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Unit"
                      defaultValue={this.food.unit}
                      onKeyUp={(event) => {
                        this.readValue(event, "unit");
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Calories"
                      defaultValue={this.food.calories}
                      onKeyUp={(event) => {
                        this.readValue(event, "calories");
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Protein"
                      defaultValue={this.food.protein}
                      onKeyUp={(event) => {
                        this.readValue(event, "protein");
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Carbs"
                      defaultValue={this.food.carb}
                      onKeyUp={(event) => {
                        this.readValue(event, "carb");
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Fat"
                      defaultValue={this.food.fat}
                      onKeyUp={(event) => {
                        this.readValue(event, "fat");
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Fibre"
                      defaultValue={this.food.fibre}
                      onKeyUp={(event) => {
                        this.readValue(event, "fibre");
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

        {/* modal end */}

        <div
          className="row"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <h3 className="col-md-3">Foods</h3>

          <Link
            to="/dashboard/foods/create"
            className="btn btn-primary col-md-2 offset-7"
          >
            Add Food
          </Link>
        </div>

        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th>Fibre</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.foods.map((food, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{food.name}</td>
                  <td>{food.weight}</td>
                  <td>{food.calories}</td>
                  <td>{food.protein}</td>
                  <td>{food.carb}</td>
                  <td>{food.fat}</td>
                  <td>{food.fibre}</td>
                  <td>{food.unit}</td>

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
                        this.delete(food._id, index);
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
