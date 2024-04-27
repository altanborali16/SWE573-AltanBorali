import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      console.log("Response : " , response.data); // Handle response
      if (response.status === 200) {
        setSuccess("Profile Updated");
        setError("");
      }
      else{
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

  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center py-3">
        <div>
          <span className="fw-bold">LOGO</span> {/* Replace with your logo */}
        </div>
        <div>
          <h1 className="text-center fw-bold">COMMUNITY PLATFORM</h1>
        </div>
        <div>
          <button className="btn" onClick={handleHomePage}>
            Home
          </button>
          <button className="btn btn-danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h1>User Profile</h1>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" value={username} disabled />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
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
