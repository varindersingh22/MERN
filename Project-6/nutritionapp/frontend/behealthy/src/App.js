import "./App.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

// component imports
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Index from "./components/Index";
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
          <Routeguard path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
