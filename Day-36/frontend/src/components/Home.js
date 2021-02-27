import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  componentDidMount = () => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((products) => {
        this.setState({ products: products });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <h3>All Products</h3>

        {/* products */}
        <div className="row">
          {this.state.products.map((product, index) => {
            return (
              <div
                className="card"
                key={index}
                style={{ width: "18rem", margin: "30px" }}
              >
                <div
                  className="card-body"
                  style={{ fontSize: "40px", textAlign: "center" }}
                >
                  <p>
                    {product.emoji}
                    {product.emoji}
                    {product.emoji}
                  </p>
                </div>

                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item font-weight-bold">
                    $ {product.price}
                  </li>
                </ul>
                <div className="card-body">
                  <Link
                    to={"/single/" + product.id}
                    className="btn btn-success"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* /// */}
      </div>
    );
  }
}

export default Home;
