import logo from "./logo.svg";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Index from "./screens/Index";
import Routeguard from "./Routeguard";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Routeguard path="/index" component={Index} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
