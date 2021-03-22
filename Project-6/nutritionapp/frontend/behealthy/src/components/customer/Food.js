import React, { Component } from "react";

import url from "../../Url";

class Food extends Component {
  constructor(props) {
    super(props);

    this.token = localStorage.getItem("authToken");

    this.state = {
      foods: [],
      searchedFood: [],
      userFoods: [],
      currentFood: {},
      currentFoodCopy: {},
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
    // to get all food
    fetch(url.BASE_URL + url.FOOD_URL, {
      headers: {
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ foods: data.foods });
        this.setState({ currentFood: data.foods[0] });
        this.setState({ currentFoodCopy: data.foods[0] });
      })
      .catch((err) => {
        console.log(err);
      });

    // to get todays food

    let userID = localStorage.getItem("userID");

    fetch(
      url.BASE_URL +
        url.USER_URL +
        "userfood/" +
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

  searchFood = (event) => {
    let userFood = event.target.value;
    this.searchField = event.target;

    if (userFood.length !== 0) {
      let tempArray = this.state.foods.filter((food, index) => {
        return food.name.toUpperCase().includes(userFood.toUpperCase());
      });

      this.setState({ searchedFood: tempArray });
    } else {
      this.setState({ searchedFood: [] });
    }
  };

  addToRoutine = () => {
    let userFood = {};

    userFood.user = localStorage.getItem("userID");
    userFood.food = this.state.currentFood._id;
    userFood.date = new Date().toDateString();
    userFood.amount = this.state.currentFood.weight;
    userFood.unit = this.state.currentFood.unit;

    fetch(url.BASE_URL + url.USER_URL + "userfood", {
      method: "POST",
      body: JSON.stringify(userFood),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        // temporray updation
        userFood.food = this.state.currentFood;
        let tempUserFoods = this.state.userFoods;
        tempUserFoods.push(userFood);
        this.setState({ userFoods: tempUserFoods });

        this.calculateTotal();

        console.log(message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  selectFood = (food) => {
    this.setState({ currentFood: food });
    this.setState({ currentFoodCopy: food });
    this.setState({ searchedFood: [] });
    if (this.amountField !== undefined) {
      this.amountField.value = "";
    }

    if (this.searchField !== undefined) {
      this.searchField.value = "";
    }
  };

  calculateMacros = (event) => {
    let userAmount = Number(event.target.value);
    this.amountField = event.target;

    if (userAmount !== 0) {
      let newCurrentFood = {};

      newCurrentFood.name = this.state.currentFood.name;
      newCurrentFood._id = this.state.currentFood._id;

      newCurrentFood.protein = (
        (this.state.currentFood.protein * userAmount) /
        this.state.currentFood.weight
      ).toFixed(4);
      newCurrentFood.carb = (
        (this.state.currentFood.carb * userAmount) /
        this.state.currentFood.weight
      ).toFixed(4);
      newCurrentFood.fibre = (
        (this.state.currentFood.fibre * userAmount) /
        this.state.currentFood.weight
      ).toFixed(4);
      newCurrentFood.fat = (
        (this.state.currentFood.fat * userAmount) /
        this.state.currentFood.weight
      ).toFixed(4);
      newCurrentFood.calories = (
        (this.state.currentFood.calories * userAmount) /
        this.state.currentFood.weight
      ).toFixed(4);
      newCurrentFood.weight = userAmount;
      newCurrentFood.unit = "g";

      this.setState({ currentFood: newCurrentFood });
    } else {
      this.setState({ currentFood: this.state.currentFoodCopy });
    }
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
        <div className="row">
          <div
            className="form-group col-12"
            style={{ height: "50px", position: "relative", zIndex: 1 }}
          >
            <input
              type="text"
              style={{ height: "50px" }}
              className="form-control"
              placeholder="Search Food"
              onChange={(event) => {
                this.searchFood(event);
              }}
            />
            <div className="search-results">
              {this.state.searchedFood.map((sfood, index) => {
                return (
                  <div
                    className="result"
                    key={index}
                    onClick={() => {
                      this.selectFood(sfood);
                    }}
                  >
                    {sfood.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-6">
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

          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{this.state.currentFood.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {this.state.currentFood.calories} Kcal
                </h6>
                <div className="card-body">
                  <div className="row">
                    <p className="col-6">
                      Protein : {this.state.currentFood.protein}
                      {this.state.currentFood.unit}
                    </p>
                    <p className="col-6">
                      Fibre : {this.state.currentFood.fibre}
                      {this.state.currentFood.unit}
                    </p>
                  </div>
                  <div className="row">
                    <p className="col-6">
                      Carbs : {this.state.currentFood.carb}
                      {this.state.currentFood.unit}
                    </p>
                    <p className="col-6">
                      Fat : {this.state.currentFood.fat}
                      {this.state.currentFood.unit}
                    </p>
                  </div>
                </div>
                <div className="card-body">
                  <label>Amount</label>
                  <input
                    className="form-control"
                    placeholder={
                      "Amount " + this.state.currentFood.weight + "g"
                    }
                    type="text"
                    onChange={(event) => {
                      this.calculateMacros(event);
                    }}
                  />
                </div>
                <button
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
            <h2 className="in-title">Todays Intake</h2>
          </div>

          {this.state.userFoods.length === 0 ? (
            <p className="col-md-12">No Food Yet</p>
          ) : (
            this.state.userFoods.map((userfood, index) => {
              return (
                <div className="col-6" key={index}>
                  <div className="card mt-2">
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

export default Food;
