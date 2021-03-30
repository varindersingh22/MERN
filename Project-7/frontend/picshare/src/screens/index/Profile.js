import React, { Component } from "react";
import url from "../../Url";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.token = "Bearer " + localStorage.getItem("authToken");
    this.user_id = localStorage.getItem("userID");
    this.user = new FormData();
    this.state = {
      profile: {},
      infulencersCount: 0,
      followersCount: 0,
      modal: false,
      singleFeed: {},
      comments: [],
      followStatus: "not-following",
      editModal: false,
    };
  }

  toggleModal = (value, index = 0) => {
    this.setState({ modal: value });
    this.setState({ singleFeed: this.state.profile.feeds[index] });

    fetch(
      url.BASE_URL + url.COMMENT + "/" + this.state.profile.feeds[index]._id,
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

  getProfileData = () => {
    let username = this.props.match.params.username;
    fetch(url.BASE_URL + url.PROFILE_URL + username, {
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((profile) => {
        console.log(profile);

        let acceptedfollowers = profile.followers.filter((follower) => {
          return follower.status === 0;
        });

        let requestedfollowers = profile.followers.filter((follower) => {
          return follower.status === 1;
        });

        profile.acceptedfollowers = acceptedfollowers;
        profile.requestedfollowers = requestedfollowers;

        this.setState({ infulencersCount: profile.influencers.length });
        this.setState({ followersCount: profile.acceptedfollowers.length });

        // checking the relationship with profile

        if (this.user_id !== profile.user._id) {
          let checkInAcceptedFollower = profile.acceptedfollowers.find(
            (follower) => {
              return (
                follower.status == 0 && follower.follower._id === this.user_id
              );
            }
          );

          if (checkInAcceptedFollower == undefined) {
            let checkInRequestedFollower = profile.requestedfollowers.find(
              (follower) => {
                return (
                  follower.status == 1 && follower.follower._id === this.user_id
                );
              }
            );
            if (checkInRequestedFollower == undefined) {
              this.setState({ followStatus: "not-following" });
            } else {
              this.setState({ followStatus: "requested" });
            }
          } else {
            this.setState({ followStatus: "following" });
          }
        } else {
          this.setState({ followStatus: "my-profile" });
        }

        this.setState({ profile: profile });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.getProfileData();
    }
  }

  componentDidMount = () => {
    this.getProfileData();
  };

  follow = () => {
    let requestData = {
      influencer: this.state.profile.user._id,
      follower: this.user_id,
    };

    fetch(url.BASE_URL + url.FOLLOW, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        let tempProfile = this.state.profile;
        console.log(message);
        if (this.state.profile.user.accounttype === "public") {
          this.setState({ followersCount: this.state.followersCount + 1 });
          this.setState({ followStatus: "following" });

          tempProfile.acceptedfollowers.unshift(message.connection);

          console.log(tempProfile.acceptedfollowers);
        } else {
          this.setState({ followStatus: "requested" });
          tempProfile.requestedfollowers.unshift(message.connection);
        }

        this.setState({ profile: tempProfile });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  unfollow_cancel = (array) => {
    let connection = array.find((follower) => {
      return this.user_id === follower.follower._id;
    });

    fetch(url.BASE_URL + url.UNFOLLOW_CANCEL + "/" + connection._id, {
      method: "DELETE",
      headers: {
        Authorization: this.token,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        this.setState({ followStatus: "not-following" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  editModalToggle = (value) => {
    this.setState({ editModal: value });
  };

  readValue(event, keyName) {
    console.log(keyName);
    if (keyName === "profilepicture") {
      console.log(event.target.value);
      this.user.append(keyName, event.target.files[0]);
    } else {
      this.user.append(keyName, event.target.value);
    }
  }

  editProfile() {
    fetch(url.BASE_URL + url.EDIT_PROFILE + "/" + this.user_id, {
      method: "PUT",
      body: this.user,
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
    let followButton = null;

    if (this.state.followStatus === "not-following") {
      followButton = (
        <button
          className="btn btn-primary"
          onClick={() => {
            this.follow();
          }}
        >
          Follow
        </button>
      );
    } else if (this.state.followStatus === "following") {
      followButton = (
        <button
          className="btn btn-primary"
          onClick={() => {
            this.unfollow_cancel(this.state.profile.acceptedfollowers);
            this.setState({ followersCount: this.state.followersCount - 1 });
          }}
        >
          Un Follow
        </button>
      );
    } else if (this.state.followStatus === "requested") {
      followButton = (
        <button
          className="btn btn-primary"
          onClick={() => {
            this.unfollow_cancel(this.state.profile.requestedfollowers);
          }}
        >
          Cancel Request
        </button>
      );
    } else if (this.state.followStatus === "my-profile") {
      followButton = (
        <button
          className="btn btn-primary"
          onClick={() => {
            this.editModalToggle(true);
          }}
        >
          Edit Profile
        </button>
      );
    }

    return (
      <div>
        {this.state.editModal === true && (
          <div className="modal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <div style={{ marginTop: "10px" }}>
                    <div className="form-group">
                      <input
                        type="text"
                        defaultValue={this.state.profile.user?.name}
                        onChange={(event) => {
                          this.readValue(event, "name");
                        }}
                        className="form-control"
                        placeholder="Name"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="file"
                        onChange={(event) => {
                          this.readValue(event, "profilepicture");
                        }}
                        className="form-control"
                        placeholder="Profile Picture"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        defaultValue={this.state.profile.user?.username}
                        onChange={(event) => {
                          this.readValue(event, "username");
                        }}
                        className="form-control"
                        placeholder="Username"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        defaultValue={this.state.profile.user?.bio}
                        onChange={(event) => {
                          this.readValue(event, "bio");
                        }}
                        className="form-control"
                        placeholder="Bio"
                      />
                    </div>

                    <div className="form-group col-12 row">
                      <button
                        className="btn btn-primary mr-3"
                        onClick={() => {
                          this.editProfile();
                        }}
                      >
                        Update
                      </button>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          this.editModalToggle(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
          <div className="userDetails">
            <div className="row">
              <div className="col-3 profilepic" style={{ overflow: "hidden" }}>
                <img
                  src={this.state.profile.user?.profilepicture}
                  style={{ width:"70%",height:"100%" }}
                />
              </div>
              <div className="col-3 offset-2 influencers">
                <div className="proContent">
                  <p>{this.state.infulencersCount}</p>
                  <p>Influencers</p>
                </div>
              </div>
              <div className="col-3 offset-1 followers">
                <div className="proContent">
                  <p>{this.state.followersCount}</p>
                  <p>Followers</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-3 mt-2">
                <h3>{this.state.profile.user?.username}</h3>
              </div>
              <div className="col-6 mt-2 offset-2">{followButton}</div>
            </div>
            <div className="row col-md-12 feedCount">
              {this.state.profile.feeds?.length} Feeds Posted
            </div>
            <div className="row feedsContainer">
              {this.state.profile.feeds !== undefined &&
                this.state.profile.feeds.map((feed, index) => {
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
      </div>
    );
  }
}
