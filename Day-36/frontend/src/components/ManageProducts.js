import React, { Component } from "react";

class ManageProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  editableOn(index) {
    let currentProducts = this.state.products;
    console.log(currentProducts);
    currentProducts[index].editable = true;
    this.setState({ products: currentProducts });
  }

  editableOff(index) {
    let currentProducts = this.state.products;
    console.log(currentProducts);
    currentProducts[index].editable = false;
    this.setState({ products: currentProducts });
  }

  deleteProduct(id) {
    fetch("http://localhost:8000/product?id=" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateOperation(index, name, event) {
    let currentProducts = this.state.products;
    currentProducts[index][name] = event.target.innerText;
  }

  updateProduct(index, id) {
    let currentProducts = this.state.products;
    let product = currentProducts[index];
    delete product.editable;

    fetch("http://localhost:8000/product?id=" + id, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.editableOff(index);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount = () => {
    fetch("http://localhost:8000/")
      .then((response) => response.json())
      .then((products) => {
        products.forEach((product) => {
          product.editable = false;
        });
        console.log(products);
        this.setState({ products: products });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="container" style={{ marginTop: "50px" }}>
        <h3>Manage Products</h3>

        <table className="table table-bordered" style={{ marginTop: "30px" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => {
              return (
                <tr key={index}>
                  <td
                    contentEditable={product.editable}
                    onInput={(event) => {
                      this.updateOperation(index, "title", event);
                    }}
                  >
                    {product.title}
                  </td>
                  <td
                    className="w-50"
                    contentEditable={product.editable}
                    onInput={(event) => {
                      this.updateOperation(index, "description", event);
                    }}
                  >
                    {product.description}
                  </td>
                  <td
                    contentEditable={product.editable}
                    onInput={(event) => {
                      this.updateOperation(index, "price", event);
                    }}
                  >
                    {product.price}
                  </td>
                  <td
                    contentEditable={product.editable}
                    onInput={(event) => {
                      this.updateOperation(index, "type", event);
                    }}
                  >
                    {product.type}
                  </td>
                  <td>
                    {product.editable === false ? (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => {
                          this.editableOn(index);
                        }}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        className="btn btn-success mr-2"
                        onClick={() => {
                          this.updateProduct(index, product.id);
                        }}
                      >
                        Save Changes
                      </button>
                    )}

                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        // actual deletion
                        this.deleteProduct(product.id);

                        // delete the same product from state just to re render
                        let currentProducts = this.state.products;
                        currentProducts.splice(index, 1);
                        this.setState({
                          products: currentProducts,
                        });
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

export default ManageProducts;
