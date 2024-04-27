import React, { useEffect, useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token :" , token)
    if (!token) {
      // Redirect to login if token is not present
      navigate("/login");
    } else {
      // Fetch user details using the token
      axios
        .get("http://localhost:8000/api/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Handle error (e.g., redirect to login)
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
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
          <Link to="/userprofile" className="btn btn-link">
            {username}
          </Link>
          <button className="btn btn-danger" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>
      <div className="content">{/* Your main content here */}</div>
    </div>
  );
};

export default Home;
