import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // corrected import
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Use navigate to redirect

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Logout function to clear the token and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page after logout
  };

  const checkTokenValidity = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = new Date().getTime() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          handleLogout(); // Token expired, log out user and redirect
        }
      } catch (error) {
        handleLogout(); // If decoding fails, log out user and redirect
      }
    } else {
      setIsAuthenticated(false);
      navigate("/login"); // If no token, redirect to login page
    }
  };

  useEffect(() => {
    checkTokenValidity();

    // Attach event listener when dropdown is open
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className={styles.wrapper_navbar}>
      <div className={styles.wrapper_width}>
        <Link to={"/"}>{/* Your SVG logo */}</Link>
        <Link className={styles.link_navbar} to={"/dashboard"}>
          Explore
        </Link>
        <div className={styles.search}>
          <FaSearch className={styles.icon} />
          <input type="search" placeholder="Search" />
        </div>
        <Link className={styles.link_navbar}>Raise Money</Link>
        <div className={styles.btns}>
          {isAuthenticated ? (
            <div className={styles.user_icons}>
              <FaBell className={styles.icon} />
              <div className={styles.dropdownContainer} ref={dropdownRef}>
                <FaUserCircle
                  className={styles.icon}
                  onClick={toggleDropdown}
                />
                {isOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link to={"/profile"} className={styles.link_dropdown}>
                      <button className={styles.dropdownItem}>Profile</button>
                    </Link>
                    <Link to={"/settings"} className={styles.link_dropdown}>
                      <button className={styles.dropdownItem}>Settings</button>
                    </Link>
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link className={styles.link_btn} to={"/login"}>
                Log in
              </Link>
              <Link to={"/registration"} className={styles.link_btn}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
