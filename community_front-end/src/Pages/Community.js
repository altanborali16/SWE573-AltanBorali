import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Community = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the community ID from the URL
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    // Fetch community data using the ID
    const fetchCommunity = async () => {
      const token = localStorage.getItem("token");
    //   console.log(token)
      try {
        const response = await axios.get(
          `http://localhost:8000/api/community/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("Response :", response.data);
        setCommunity(response.data);
      } catch (error) {
        console.error("Error fetching community data:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchCommunity(); // Call the fetch function on component mount
  }, [id]);

  const handleHomePage = () => {
    navigate("/home");
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  if (!community) {
    return <div>Loading...</div>; // Placeholder for loading state
  }

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
      <div className="container">
        <h1>{community.name}</h1>
        <p>Description: {community.description}</p>
        <p>Owner: {community.owner.username}</p>
        <p>
          Managers:{" "}
          {community.managers.map((manager) => manager.username).join(", ")}
        </p>
        {/* Additional community details can be displayed here */}
      </div>
    </div>
  );
};

export default Community;
