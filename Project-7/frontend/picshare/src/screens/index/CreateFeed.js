import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";

export default class CreateFeed extends Component {
  constructor(props) {
    super(props);
    this.token = "Bearer " + localStorage.getItem("authToken");
    this.userID = localStorage.getItem("userID");
    this.feed = new FormData();
    this.feed.append("user", this.userID);

    this.fields = {};
    this.state = {};
  }

  readValue(event, keyName) {
    if (keyName === "picture") {
      this.feed.append(keyName, event.target.files[0]);
    } else if (keyName === "hashtags" || keyName === "tags") {
      this.feed.append(keyName, event.target.value.split(","));
    } else {
      this.feed.append(keyName, event.target.value);
    }

    this.fields[keyName] = event.target;
  }

  createFeed() {
    fetch(url.BASE_URL + url.CREATE_FEED, {
      method: "POST",
      body: this.feed,
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        console.log(message);

        // this.fields.caption.value = "";
        // this.fields.picture.value = "";
        // this.fields.location.value = "";
        // this.fields.hashtags.value = "";
        // this.fields.tags.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div
        className="container card"
        style={{ marginTop: "50px", paddingTop: "20px" }}
      >
        <h2 className="in-title">Upload Feed</h2>

        <div style={{ marginTop: "10px" }}>
          <div className="form-group">
            <input
              type="text"
              onChange={(event) => {
                this.readValue(event, "caption");
              }}
              className="form-control"
              placeholder="Caption"
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              onChange={(event) => {
                this.readValue(event, "picture");
              }}
              className="form-control"
              placeholder="Picture"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              onChange={(event) => {
                this.readValue(event, "hashtags");
              }}
              className="form-control"
              placeholder="Hashtags (#tag,#tag2...#tagn)"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              onChange={(event) => {
                this.readValue(event, "tags");
              }}
              className="form-control"
              placeholder="Tags (@username,@usernme2...@usernameN)"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              onChange={(event) => {
                this.readValue(event, "location");
              }}
              className="form-control"
              placeholder="Location"
            />
          </div>

          <div className="form-group col-12 row">
            <button
              className="btn btn-primary mr-3"
              onClick={() => {
                this.createFeed();
              }}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
