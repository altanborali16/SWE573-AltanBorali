import React from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = ({
  handleHomePage,
  handleSignOut,
  handleMyCommunities,
  handleCommunities,
  handleUserSettings,
}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="nav-link btn" onClick={handleHomePage}>
          LOGO
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleMyCommunities}>
                My Communities
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={handleCommunities}>
                Communities
              </button>
            </li>
          </ul>
          <div className="dropdown ms-2">
            <button
              className="btn  dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              User
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button className="dropdown-item" onClick={handleSignOut}>
                  Logout
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleUserSettings}>
                  User Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
