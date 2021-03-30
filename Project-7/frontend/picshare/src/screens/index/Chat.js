import React, { Component } from "react";
import url from "../../Url";
import io from "socket.io-client";
export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.token = "Bearer " + localStorage.getItem("authToken");
    this.user_id = localStorage.getItem("userID");
    this.state = {
      users: [],
      chats: [],
      reciever: null,
    };
  }

  loadChats = (user2_id) => {
    this.setState({ reciever: user2_id });
    fetch(url.BASE_URL + "chat/chats/" + this.user_id + "/" + user2_id, {
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((chats) => {
        console.log(chats);
        this.setState({ chats: chats });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    fetch(url.BASE_URL + "chat/conversation/" + this.user_id, {
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((users) => {
        this.setState({ users: users });
      })
      .catch((err) => {
        console.log(err);
      });

    this.socket = io("http://localhost:8000", { query: { id: this.user_id } });

    this.socket.on("recieve-message", (chat) => {
      let tempChats = this.state.chats;
      tempChats.push(chat);
      this.setState({ chats: tempChats });
    });
  };

  componentWillUnmount = () => {
    this.socket.close();
  };

  sendMessage = (event) => {
    if (event.code === "Enter") {
      let chat = {
        sender: this.user_id,
        reciever: this.state.reciever,
        message: event.target.value,
      };

      this.socket.emit("send-message", chat);

      let tempChats = this.state.chats;
      tempChats.push(chat);
      this.setState({ chats: tempChats });
      event.target.value = "";
    }
  };

  render() {
    return (
      <div className="col-8 offset-2">
        <div className="row">
          <div className="col-4" style={{ height: "90vh" }}>
            <ul>
              {this.state.users.map((user, index) => (
                <li
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid lightgray",
                  }}
                  key={index}
                  onClick={() => {
                    this.loadChats(user._id);
                  }}
                >
                  <strong>{user.username}</strong>
                  <br />
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-8" style={{ height: "90vh" }}>
            <div
              className="col-md-12"
              style={{
                height: "80vh",
                boxShadow: "inset 0 0 5px gray",
                paddingTop: "20px",
                overflow: "scroll",
                overflowX: "visible",
              }}
            >
              {this.state.chats.map((chat, index) =>
                chat.sender.toString() === this.user_id.toString() ? (
                  <div className="chatM" key={index} style={{ float: "right" }}>
                    {chat.message}
                  </div>
                ) : (
                  <div className="chatM" key={index} style={{ float: "left" }}>
                    {chat.message}
                  </div>
                )
              )}
            </div>
            <div className="col-12">
              <div className="form-group mt-2">
                <input
                  className="form-control"
                  placeholder="Write Here..."
                  onKeyUp={(event) => {
                    this.sendMessage(event);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
