import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navbar';

const UserProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          const { username, email, first_name, last_name } = response.data;
          setUsername(username);
          setEmail(email);
          setFirstName(first_name);
          setLastName(last_name);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/update_user/",
        {
          email,
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Response : ", response.data); // Handle response
      if (response.status === 200) {
        setSuccess("Profile Updated");
        setError("");
      } else {
        setError("Profile cannot Updated");
        setSuccess("");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Profile cannot Updated");
      setSuccess("");
      // Handle error (e.g., show an error message)
    }
  };
  const handleHomePage = () => {
    navigate("/home");
  };
  const handleSignOut = () => {
    navigate("/login");
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
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h1>User Profile</h1>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                className="form-control"
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                className="form-control"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                className="form-control"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
