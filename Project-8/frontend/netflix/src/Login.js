import React, { Component } from "react";
import url from "./Urls";
import { Link } from "react-router-dom";
import "./style.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logConf: false,
    };
    this.user = {};
  }

  hideLogMessage() {
    this.setState({ logConf: false });
  }

  readValue(event, keyName) {
    this.user[keyName] = event.target.value;
  }

  loginUser() {
    fetch(url.BASE_URL + url.LOGIN_URL, {
      method: "POST",
      body: JSON.stringify(this.user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.code === 0) {
          this.setState({ logConf: true });
        } else {
          localStorage.setItem("authToken", message.token);
          localStorage.setItem("authStatus", "true");
          localStorage.setItem("userID", message.user._id);
          localStorage.setItem("userName", message.user.username);

          this.props.history.replace("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="App">
      <header className="showcase">
			<div className="showcase-top">
				<img src="https://i.ibb.co/r5krrdz/logo.png" alt="" />
			
			</div>
			<div className="showcase-content">
				<div>
          <br></br>
        <h2 className="in-title" style={{paddingTop:"10px"}}>Login</h2>

        {this.state.logConf === true ? (
          <div
            style={{ marginTop: "20px" }}
            className="alert alert-danger"
            onClick={() => {
              this.hidelogMessage();
            }}
          >
            Wrong username or password
          </div>
        ) : null}

        <div style={{ marginTop: "10px" }}>
          <div className="form-group"></div>
          <div className="form-group">
            <input style={{padding:"10px"}}
              type="email"
              onKeyUp={(event) => {
                this.readValue(event, "email");
              }}
              className="form-control"
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password" style={{padding:"10px"}}
              onKeyUp={(event) => {
                this.readValue(event, "password");
              }}
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="form-group col-12 row">
            <button
              className="btn btn-primary"
              onClick={() => {
                this.loginUser();
              }}
            >
              Login
            </button>
            <Link to="/register" className="nav-link">
              <p style={{ color: "white" }}>Do Not Have a Account? Register Now</p>
            </Link>
            </div>
          
          </div>
        
          </div>
          
		
    </div>

    </header>
			
    </div>

      
    );
  }
}

export default Login;
