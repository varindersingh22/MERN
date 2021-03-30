import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import url from "../../Url";
import { Link } from "react-router-dom";
import {
  faHeart,
  faComment,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.token = "Bearer " + localStorage.getItem("authToken");
    this.user_id = localStorage.getItem("userID");
    this.state = {
      randomfeeds: [],
      modal: false,
      singleFeed: {},
      comments: [],
      users: [],
      searchedUsers: [],
    };
  }

  searchUsers = (event) => {
    let searchedValue = event.target.value;

    if (searchedValue.length !== 0) {
      let searchedUsers = this.state.users.filter((user) => {
        return (
          user.username.toLowerCase().includes(searchedValue.toLowerCase()) ||
          user.name.toLowerCase().includes(searchedValue.toLowerCase())
        );
      });

      this.setState({ searchedUsers: searchedUsers });
    } else {
      this.setState({ searchedUsers: [] });
    }
  };

  toggleModal = (value, index = 0) => {
    this.setState({ modal: value });
    this.setState({ singleFeed: this.state.randomfeeds[index] });

    fetch(
      url.BASE_URL + url.COMMENT + "/" + this.state.randomfeeds[index]._id,
      {
        headers: {
          Authorization: this.token,
        },
      }
    )
      .then((response) => response.json())
      .then((comments) => {
        // console.log(comments);
        this.setState({ comments: comments });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  createComment = (event, feed_id) => {
    if (event.code === "Enter" && event.target.value.length != 0) {
      let comment = {
        feed: feed_id,
        user: this.user_id,
        comment: event.target.value,
      };

      fetch(url.BASE_URL + url.COMMENT, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
      })
        .then((response) => response.json())
        .then((message) => {
          event.target.value = "";
          let tempComments = this.state.comments;
          comment.user = {};
          comment.user.username = localStorage.getItem("userName");
          tempComments.unshift(comment);

          console.log(tempComments);

          this.setState({ comments: tempComments });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  likePost = (feed_id) => {
    fetch(url.BASE_URL + url.LIKE, {
      method: "POST",
      body: JSON.stringify({ feed: feed_id, user: this.user_id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        console.log(message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount = () => {
    fetch(url.BASE_URL + url.RANDOM_FEEDS + "/" + this.user_id, {
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((randomfeeds) => {
        this.setState({ randomfeeds: randomfeeds });
      })
      .catch((err) => {
        console.log(err);
      });

    // fethching all the users

    fetch(url.BASE_URL + url.GET_USERS, {
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
  };

  render() {
    return (
      <div>
        {this.state.modal == true && (
          <div className="modal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="row">
                    <div
                      className="card col-5"
                      style={{
                        marginLeft: "50px",
                      }}
                    >
                      <div className="card-body username-body">
                        <h5
                          className="card-title"
                          style={{ marginBottom: "0px !important" }}
                        >
                          <Link
                            to={
                              "/index/profile/" +
                              this.state.singleFeed.user.username
                            }
                          >
                            {this.state.singleFeed.user.username}
                          </Link>
                        </h5>
                      </div>
                      <img
                        src={this.state.singleFeed.picture}
                        className="card-img-top"
                        alt="..."
                      />
                      <div className="card-body">
                        <div className="row">
                          <p className="mr-2">
                            {this.state.singleFeed.alreadyLiked === true ? (
                              <FontAwesomeIcon
                                style={{ color: "red" }}
                                icon={faHeart}
                                onClick={() => {
                                  this.likePost(this.state.singleFeed._id);

                                  let singleFeed = this.state.singleFeed;
                                  singleFeed.alreadyLiked = false;
                                  singleFeed.likesCount =
                                    Number(this.state.singleFeed.likesCount) -
                                    1;
                                  this.setState({ singleFeed: singleFeed });
                                }}
                                className="mr-2"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faHeart}
                                onClick={() => {
                                  this.likePost(this.state.singleFeed._id);
                                  let singleFeed = this.state.singleFeed;
                                  singleFeed.alreadyLiked = true;
                                  singleFeed.likesCount =
                                    Number(this.state.singleFeed.likesCount) +
                                    1;
                                  this.setState({ singleFeed: singleFeed });
                                }}
                                className="mr-2"
                              />
                            )}

                            {this.state.singleFeed.likesCount}
                          </p>
                        </div>
                        <div className="row">
                          <p className="card-text">
                            {this.state.singleFeed.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="insert-comment col-12">
                        <div className="form-group">
                          <input
                            className="form-control"
                            placeholder="Write Comment..."
                            onKeyUp={(event) => {
                              this.createComment(
                                event,
                                this.state.singleFeed._id
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="col-12"
                        style={{
                          overflow: "scroll",
                          overflowX: "visible",
                          height: "400px",
                        }}
                      >
                        {this.state.comments.map((comment, index) => (
                          <div key={index}>
                            <strong>{comment.user.username}</strong>
                            <p>{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      this.toggleModal(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* end of modal  */}

        <div className="container">
          <div className="searchUser">
            <div
              style={{
                border: "1px solid lightgray",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <button
                style={{
                  width: "10%",
                  float: "left",
                  paddingTop: "7px",
                  paddingBottom: "7px",
                }}
                className="searchButton"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <input
                className="form-control"
                placeholder="Search by Name"
                style={{ width: "90%", border: "none", borderRadius: "0px" }}
                onChange={(event) => {
                  this.searchUsers(event);
                }}
              />
            </div>
            <div className="col-md-12 search-results">
              {this.state.searchedUsers.map((user, index) => (
                <Link key={index} to={"/index/profile/" + user.username}>
                  <div className="result">
                    <strong>{user.username}</strong>
                    <p>{user.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="row feedsContainer">
            {this.state.randomfeeds.map((feed, index) => {
              let bg = {
                backgroundImage: `url('${feed.picture}')`,
                backgroundSize: "cover",
              };
              return (
                <div
                  className="feed"
                  key={index}
                  style={bg}
                  onClick={() => {
                    this.toggleModal(true, index);
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
