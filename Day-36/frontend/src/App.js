import "./App.css";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import SingleProduct from "./components/SingleProduct";
import ManageProducts from "./components/ManageProducts";
import {
  Route,
  BrowserRouter as RouterModule,
  Link,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <RouterModule>
        {/* navigtion jsx (HTML) */}

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              Supermarket
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link active" aria-current="page">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/add" className="nav-link">
                    Add Product
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/manage" className="nav-link">
                    Manage Products
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* ///// */}

        {/* <Home />
      <AddProduct />
      <ViewProduct /> */}

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/add" exact component={AddProduct} />
          <Route path="/manage" exact component={ManageProducts} />
          <Route path="/single/:id" exact component={SingleProduct} />
          <Route render={() => <h1>Page Not Found</h1>} exact />
        </Switch>
      </RouterModule>
    </div>
  );
}

export default App;
