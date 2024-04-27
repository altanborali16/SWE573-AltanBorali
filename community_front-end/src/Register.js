import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are mandatory");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username,
        email,
        password,
      });
      console.log(response.data);
      if (response.status === 201) {
        navigate("/login");
      } else {
        setError("Registration failed");
      }
    } catch (error) {
      console.error(error); // Handle error
      if (error.response && error.response.status === 400) {
        setError("Username already exists"); // Username already exists
      }
      else {
        setError("Registration failed"); // Other errors
      }
    }
  };

  return (
    <div className="container">
      <header className="d-flex justify-content-center align-items-center py-3">
        <div>
        <h1 className="text-center fw-bold">COMMUNITY PLATFORM</h1>
        </div>
      </header>
      <div className="row justify-content-center mt-5">
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
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
          <div className="mt-3">
            <Link to="/login" className="btn btn-link">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
