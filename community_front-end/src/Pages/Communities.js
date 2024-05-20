import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import NavbarWithSearch from "./NavbarWithSearch";

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [subInfoMessage, setSubInfoMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/current_user/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          setCurrentUser(response.data);
          console.log("Current User:", response.data);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      }
    };

    fetchCurrentUser();
    const fetchCommunities = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/communities/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          setCommunities(response.data);
          setFilteredCommunities(response.data);
          console.log("Communities:", response.data);
        } catch (error) {
          console.error("Error fetching communities:", error);
        }
      }
    };

    fetchCommunities();
  }, []);

  const handleManage = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  const handleGo = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  const handleSubscribe = async (communityId) => {
    console.log("com id : " + communityId);
    const token = localStorage.getItem("token");
    console.log("token : ", token);
    if (token) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/follow_community/${communityId}/`,
          null,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update the UI or state to reflect the follow action
        const updatedCommunities = communities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              followers: [...community.followers, currentUser.id],
            };
          }
          return community;
        });
        const updatedFilteredCommunities = filteredCommunities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              followers: [...community.followers, currentUser.id],
            };
          }
          return community;
        });

        // Set the updated communities state
        setCommunities(updatedCommunities);
        setFilteredCommunities(updatedFilteredCommunities);
        setSubInfoMessage(response.data.message);
        console.log(response.data.message);
      } catch (error) {
        console.error("Error following community:", error);
      }
    }
  };
  const handleUnsubscribe = async (communityId) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/unfollow_community/${communityId}/`,
          null,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update the UI or state to reflect the unsubscribe action
        const updatedCommunities = communities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              followers: community.followers.filter(
                (followerId) => followerId !== currentUser.id
              ),
            };
          }
          return community;
        });
        const updatedFiteredCommunities = filteredCommunities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              followers: community.followers.filter(
                (followerId) => followerId !== currentUser.id
              ),
            };
          }
          return community;
        });

        // Set the updated communities state
        setCommunities(updatedCommunities);
        setFilteredCommunities(updatedFiteredCommunities);
        setSubInfoMessage(response.data.message);

        console.log(response.data.message);
      } catch (error) {
        console.error("Error unsubscribing from community:", error);
      }
    }
  };
  const handleAction = (communityId) => {
    // Perform appropriate action based on the user's role
    if (communityId == null) return;
    const community = communities.find((c) => c.id === communityId);
    if (!community) return;

    if (community.owner.id === currentUser.id) {
      handleManage(community.id);
    } else if (
      community.followers &&
      community.followers.includes(currentUser.id)
    ) {
      handleGo(community.id);
    } else {
      handleSubscribe(community.id);
    }
  };

  const handleHomePage = () => {
    navigate("/home");
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleMyCommunities = () => {
    navigate("/usercommunities");
  };
  const handleCommunities = () => {
    navigate("/communities");
  };
  const handleUserSettings = () => {
    navigate("/userprofile");
  };
  // Function to handle search input change
  const handleSearch = (e) => {
    // console.log("E : " , e)
    filterCommunities(e);
  };

  // Function to filter communities based on search query
  const filterCommunities = (query) => {
    const filtered = communities.filter(
      (community) =>
        community.name.toLowerCase().includes(query.toLowerCase()) ||
        community.description.toLowerCase().includes(query.toLowerCase()) ||
        community.owner.email.toLowerCase().includes(query.toLowerCase()) ||
        community.owner.first_name.toLowerCase().includes(query.toLowerCase()) ||
        community.owner.last_name.toLowerCase().includes(query.toLowerCase()) ||
        community.owner.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCommunities(filtered);
  };

  return (
    <div className="container">
      {/* NavbarWithSearch */}
      <NavbarWithSearch
        handleHomePage={handleHomePage}
        handleSignOut={handleSignOut}
        handleMyCommunities={handleMyCommunities}
        handleCommunities={handleCommunities}
        handleUserSettings={handleUserSettings}
        handleSearch={handleSearch}
      />
      <h1>Communities</h1>
      <div className="row">
      {subInfoMessage && (
            <div className="alert alert-success">{subInfoMessage}</div>
          )}
        {filteredCommunities && filteredCommunities.length > 0 ? (
          filteredCommunities.map((community) => (
            <div className="col-md-4 mb-4" key={community.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{community.name}</h5>
                  <p className="card-text">{community.description}</p>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleAction(community.id)}
                  >
                    {community.owner.id === currentUser.id
                      ? "Manage"
                      : community.followers &&
                        community.followers.includes(currentUser.id)
                      ? "Visit"
                      : "Subscribe"}
                  </button>
                  {community.followers &&
                    community.followers.includes(currentUser.id) && (
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleUnsubscribe(community.id)}
                      >
                        Unsubscribe
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No communities to display</p>
        )}
      </div>
    </div>
  );
};

export default Communities;
