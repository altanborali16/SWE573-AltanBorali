import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from './Navbar';

const UserCommunities = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch communities when the component mounts
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8000/api/communities/usercommunities/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => setCommunities(response.data))
        .catch((error) => console.error("Error fetching communities:", error));
    }
  }, []);
  const handleCreateCommunity = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Handle authentication error, redirect to login
      navigate("/login");
      return;
    }
    if (!communityName || !communityDescription) {
      setError("Community name or description cannot be empty");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/communities/",
        {
          name: communityName,
          description: communityDescription,
          is_private: isPrivate,
          is_deleted: false,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setCommunities([...communities, response.data]);
      setCommunityName("");
      setCommunityDescription("");
      setIsPrivate(false);
      setShowModal(false);
      setSuccess("Community created successfully");
      setError("");
    } catch (error) {
      setError("Error creating community");
      setSuccess("");
      console.error("Error creating community:", error);
    }
  };
  const handleHomePage = () => {
    navigate("/home");
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`);
  };
  const handleMyCommunities = () => {
    navigate("/usercommunities");
  };
  const handleCommunities = () => {
    // navigate("/usercommunities");
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
      <h1 className="my-4">My Communities</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row">
        {/* Button to open modal */}
        <div className="col-md-6">
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowModal(true)}
          >
            Create New Community
          </button>
        </div>
      </div>
      {/* Display existing communities */}
      <div className="row">
        {communities.map((community) => (
          <div className="col-md-6" key={community.id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{community.name}</h5>
                <p className="card-text">{community.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleCommunityClick(community.id)}
                >
                  Open Community
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating a new community */}
      <div
        className={`modal ${showModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
      >
        {/* Modal content here */}
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Community</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {/* Form for creating a new community */}
              <form onSubmit={handleCreateCommunity}>
                <div className="mb-3">
                  <label htmlFor="communityName">Name:</label>
                  <input
                    type="text"
                    id="communityName"
                    className="form-control"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="communityDescription">Description:</label>
                  <textarea
                    id="communityDescription"
                    className="form-control"
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isPrivate">
                    Is Private
                  </label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleCreateCommunity}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCommunities;
