import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./Navbar";

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
          console.log("Communities:", response.data);
        } catch (error) {
          console.error("Error fetching communities:", error);
        }
      }
    };

    fetchCommunities();
  }, []);


  const handleManage = (communityId) => {
    // Handle manage button click
  };

  const handleGo = (communityId) => {
    // Handle go button click
  };

  const handleSubscribe = async (communityId) => {
    console.log("com id : " + communityId);
    const token = localStorage.getItem("token");
    console.log("token : ", token);
    if (token) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/follow_community/${communityId}/`,
          null,  // You're not sending any data in this POST request, so use null
          {
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',  // Content-Type header is correct
            },
          }
        );
  
        // Update the UI or state to reflect the follow action
        // For example, update the communities state to show the user is following
        const updatedCommunities = communities.map((community) => {
          if (community.id === communityId) {
            return {
              ...community,
              followers: [...community.followers, currentUser.id], // Assuming currentUser.id is the user's ID
            };
          }
          return community;
        });
        setCommunities(updatedCommunities);
        console.log(response.data.message);
      } catch (error) {
        console.error("Error following community:", error);
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
    navigate("/commmunities");
  };
  const handleUserSettings = () => {
    navigate("/userprofile");
  };

  return (
    <div className="container">
      {/* Navbar */}
      <Navbar
        handleHomePage={handleHomePage}
        handleSignOut={handleSignOut}
        handleMyCommunities={handleMyCommunities}
        handleCommunities={handleCommunities}
        handleUserSettings={handleUserSettings}
      />
      <h1>Communities</h1>
      <div className="row">
        {communities && communities.length > 0 ? (
          communities.map((community) => (
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
                      ? "Go"
                      : "Subscribe"}
                  </button>
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
