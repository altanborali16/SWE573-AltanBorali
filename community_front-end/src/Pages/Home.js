import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate();
  // const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("Token :" , token)
    if (!token) {
      // Redirect to login if token is not present
      navigate("/login");
    } else {
      // // Fetch user details using the token
      // axios
      //   .get("http://localhost:8000/api/user/", {
      //     headers: {
      //       Authorization: `Token ${token}`,
      //     },
      //   })
      //   .then((response) => {
      //     setUsername(response.data.username);
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching user data:", error);
      //     // Handle error (e.g., redirect to login)
      //     navigate("/login");
      //   }
      //   );
    }
  }, [navigate]);
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
      <div className="content">{/* Your main content here */}</div>
    </div>
  );
};

export default Home;
