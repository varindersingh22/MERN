import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.token = "Bearer " + localStorage.getItem("authToken");
    this.user_id = localStorage.getItem("userID");
    this.state = {
      feeds: [],
      modal: false,
      singleFeed: {},
      comments: [],
    };
  }

  toggleModal = (value, index = 0) => {
    this.setState({ modal: value });
    this.setState({ singleFeed: this.state.feeds[index] });

    fetch(url.BASE_URL + url.COMMENT + "/" + this.state.feeds[index]._id, {
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((comments) => {
        console.log(comments);
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
    fetch(url.BASE_URL + url.HOME + this.user_id, {
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((feeds) => {
        feeds.map((feed) => {
          if (feed.likesCount === undefined) {
            feed.likesCount = 0;
          }

          if (feed.alreadyLiked === undefined) {
            feed.alreadyLiked = false;
          }
        });

        this.setState({ feeds: feeds });
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
          {this.state.feeds.map((feed, index) => {
            return (
              <div
                key={index}
                className="card"
                style={{ width: "80%", marginLeft: "10%", marginTop: "30px",height:"60%" }}
              >
                <div className="card-body username-body">
                  <h5
                    className="card-title"
                    style={{ marginBottom: "0px !important" }}
                  >
                    <Link to={"/index/profile/" + feed.user.username}>
                      {feed.user.username}
                    </Link>
                  </h5>
                </div>
                <img
                  src={feed.picture}
                  className="card-img-top"
                  alt="..."
                  onClick={() => {
                    this.toggleModal(true, index);
                  }}
                />
                <div className="card-body">
                  <div className="row">
                    <p className="mr-2">
                      {feed.alreadyLiked === true ? (
                        <FontAwesomeIcon
                          style={{ color: "red" }}
                          icon={faHeart}
                          onClick={() => {
                            this.likePost(feed._id);

                            let tempFeeds = this.state.feeds;
                            tempFeeds[index].alreadyLiked = false;
                            tempFeeds[index].likesCount =
                              Number(tempFeeds[index].likesCount) - 1;
                            this.setState({ feeds: tempFeeds });
                          }}
                          className="mr-2"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faHeart}
                          onClick={() => {
                            this.likePost(feed._id);
                            let tempFeeds = this.state.feeds;
                            tempFeeds[index].alreadyLiked = true;
                            tempFeeds[index].likesCount =
                              Number(tempFeeds[index].likesCount) + 1;
                            this.setState({ feeds: tempFeeds });
                          }}
                          className="mr-2"
                        />
                      )}

                      {feed.likesCount}
                    </p>
                    <p>
                      <FontAwesomeIcon
                        icon={faComment}
                        onClick={() => {
                          this.toggleModal(true, index);
                        }}
                      />
                    </p>
                  </div>
                  <div className="row">
                    <p className="card-text">{feed.caption}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
