import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("All fields are mandatory");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });
      console.log(response.data); // Handle response
    } catch (error) {
      console.error(error); // Handle error
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
        {error && <div className="alert alert-danger">{error}</div>}
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
          <div className="mt-3">
            <Link to="/register" className="btn btn-link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
