import React, { Component } from "react";

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      message: null,
    };

    this.product = {};
    this.fields = {};
  }

  async addProduct() {
    await this.setState({ product: this.product });

    fetch("http://localhost:8000/product", {
      method: "POST",
      body: JSON.stringify(this.state.product),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ message: data });

        this.fields.id.value = "";
        this.fields.title.value = "";
        this.fields.description.value = "";
        this.fields.price.value = "";
        this.fields.type.value = "";
        this.fields.emoji.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  readValue(event, name) {
    this.product[name] = event.target.value;
    this.fields[name] = event.target;
  }

  render() {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <h3>Add Product</h3>

        {this.state.message != null ? (
          <div className="alert alert-success">Product Added</div>
        ) : null}

        <div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Enter ID"
              className="form-control"
              onKeyUp={(event) => {
                this.readValue(event, "id");
              }}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Title"
              className="form-control"
              onKeyUp={(event) => {
                this.readValue(event, "title");
              }}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Enter Description"
              className="form-control"
              onKeyUp={(event) => {
                this.readValue(event, "description");
              }}
            ></textarea>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Enter Price"
              className="form-control"
              onKeyUp={(event) => {
                this.readValue(event, "price");
              }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Type"
              className="form-control"
              onKeyUp={(event) => {
                this.readValue(event, "type");
              }}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Emoji"
              className="form-control"
              onKeyUp={(event) => {
                this.readValue(event, "emoji");
              }}
            />
          </div>

          <div className="form-group">
            <button
              className="btn btn-success"
              type="button"
              onClick={() => {
                this.addProduct();
              }}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddProduct;
