import React, { Component } from "react";

import url from "../../Url";

export default class FoodHistory extends Component {
  constructor(props) {
    super(props);

    this.token = localStorage.getItem("authToken");

    this.state = {
      userFoods: [],
      date: new Date().toDateString(),
      total: {
        calories: 0,
        carb: 0,
        protein: 0,
        fat: 0,
        fibre: 0,
        amount: 0,
        unit: "g",
      },
    };
  }

  componentDidMount = () => {
    this.getUserFoodOnDate(new Date().toDateString());
  };

  getUserFoodOnDate = (date) => {
    this.setState({ date: date });
    let userID = localStorage.getItem("userID");

    fetch(url.BASE_URL + url.USER_URL + "userfood/" + userID + "/" + date, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let tempUserFoods = data.userfoods.map((userfood, index) => {
          userfood.food.protein = (
            (userfood.food.protein * userfood.amount) /
            userfood.food.weight
          ).toFixed(4);
          userfood.food.calories = (
            (userfood.food.calories * userfood.amount) /
            userfood.food.weight
          ).toFixed(4);
          userfood.food.fat = (
            (userfood.food.fat * userfood.amount) /
            userfood.food.weight
          ).toFixed(4);
          userfood.food.carb = (
            (userfood.food.carb * userfood.amount) /
            userfood.food.weight
          ).toFixed(4);
          userfood.food.fibre = (
            (userfood.food.fibre * userfood.amount) /
            userfood.food.weight
          ).toFixed(4);

          return userfood;
        });

        this.setState({ userFoods: tempUserFoods });

        this.calculateTotal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  calculateTotal = () => {
    let total = {
      calories: 0,
      carb: 0,
      protein: 0,
      fat: 0,
      fibre: 0,
      amount: 0,
      unit: "g",
    };

    this.state.userFoods.forEach((userfood, index) => {
      total.protein += Number(userfood.food.protein);
      total.carb += Number(userfood.food.carb);
      total.fibre += Number(userfood.food.fibre);
      total.fat += Number(userfood.food.fat);
      total.calories += Number(userfood.food.calories);
    });

    this.setState({ total: total });
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
              this.getUserFoodOnDate(
                new Date(event.target.value).toDateString()
              );
            }}
          />
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body total-cal">
                <h1>{this.state.total.calories.toFixed(3)}</h1>
                <span>Total Caloric Intake</span>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Total Protein : {this.state.total.protein.toFixed(3)}
                  {this.state.total.unit}
                </li>
                <li className="list-group-item">
                  Total Fat : {this.state.total.fat.toFixed(3)}
                  {this.state.total.unit}
                </li>
                <li className="list-group-item">
                  Total Carbohydrates : {this.state.total.carb.toFixed(3)}
                  {this.state.total.unit}
                </li>
                <li className="list-group-item">
                  Total Fibre : {this.state.total.fibre.toFixed(3)}
                  {this.state.total.unit}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row mt-5 mb-5">
          <div className="col-12">
            <h2 className="in-title">{this.state.date} Foods</h2>
          </div>
          {this.state.userFoods.length === 0 ? (
            <p className="col-md-12">No Food Yet</p>
          ) : (
            this.state.userFoods.map((userfood, index) => {
              return (
                <div class="col-6">
                  <div className="card mt-2" key={index}>
                    <div className="card-body">
                      <h5 className="card-title">{userfood.food.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {userfood.food.calories} Kcal ( {userfood.amount}
                        {userfood.unit} )
                      </h6>
                      <div className="card-body">
                        <div className="row">
                          <p className="col-6">
                            Protein : {userfood.food.protein}
                            {userfood.unit}
                          </p>
                          <p className="col-6">
                            Fibre : {userfood.food.fibre}
                            {userfood.unit}
                          </p>
                        </div>
                        <div className="row">
                          <p className="col-6">
                            Carbs : {userfood.food.carb}
                            {userfood.unit}
                          </p>
                          <p className="col-6">
                            Fat : {userfood.food.fat}
                            {userfood.unit}
                          </p>
                        </div>
                      </div>
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
