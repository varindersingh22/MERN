import React, { Component } from "react";

class SingleProduct extends Component {
  constructor(props) {
    super(props);

    this.id = this.props.match.params.id;

    this.state = {
      product: {},
    };
  }

  componentDidMount = () => {
    fetch("http://localhost:8000/product?id=" + this.id)
      .then((response) => response.json())
      .then((product) => {
        this.setState({ product: product });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <h3>{this.state.product.title}</h3>

        <div className="card col-md-8">
          <div
            className="card-body"
            style={{ fontSize: "40px", textAlign: "center" }}
          >
            <p>
              {this.state.product.emoji}
              {this.state.product.emoji}
              {this.state.product.emoji}
            </p>
          </div>

          <div className="card-body">
            {/* <h5 className="card-title">Card title</h5> */}
            <p className="card-text">{this.state.product.description}</p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item font-weight-bold">
              $ {this.state.product.price}
            </li>
            <li className="list-group-item">{this.state.product.type}</li>
            <li className="list-group-item">{this.state.product.rating}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SingleProduct;
