import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import {  Card } from "react-bootstrap";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/recent_posts/",
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          // Assuming the API response contains an array of posts
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching posts:", error);
          // Handle error (e.g., redirect to login)
          navigate("/login");
        }
      };
      fetchPosts();
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
    navigate("/communities");
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
      <div className="content">
        <h1>Recent Posts</h1>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="mb-3">
              <Card.Body>
                {post.input &&
                  Object.keys(JSON.parse(post.input)).map((key, index) => (
                    <div key={index}>
                      {key === "title" ? (
                        <Card.Title>{JSON.parse(post.input)[key]}</Card.Title>
                      ) : (
                        <Card.Text>
                          <strong>{key}:</strong> {JSON.parse(post.input)[key]}
                        </Card.Text>
                      )}
                    </div>
                  ))}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No recent posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;