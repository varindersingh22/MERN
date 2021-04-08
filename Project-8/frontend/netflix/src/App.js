import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Home from "./screens/Home";
import Routeguard from "./Routeguard";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Routeguard path="/home" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
