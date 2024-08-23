import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import Axios
import styles from "./LoginForm.module.scss";
import oneid from "../../assets/oneid.png";
import quant from "../../assets/quant.png";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setErrorMessage(""); // Clear any previous errors

    const requestBody = {
      username,
      password,
    };

    try {
      // Fetch login API using Axios
      const response = await axios.post(
        "http://161.35.19.77:8001/api/auth/login/",
        requestBody
      );

      const { token } = response.data;

      // Check if login is successful and token exists
      if (token) {
        // Store token in localStorage or use AuthContext for global state management
        localStorage.setItem("token", token);

        // Navigate to the explore page if logged in successfully
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle errors (login failure or network issue)
      if (error.response && error.response.data.message) {
        setErrorMessage("Login failed: " + error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }

      // Navigate to the last registration page if login fails
      navigate("/lastregistration");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <svg
          width="66"
          height="47"
          viewBox="0 0 66 47"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG content */}
        </svg>

        <h1>
          We are <span className={styles.highlightYellow}>happy</span> to <br />{" "}
          see you <span className={styles.highlightGreen}>again</span>!
        </h1>
        <p>
          Together, we're making <br /> dreams a reality.
        </p>
      </div>
      <div className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className={styles.inputField}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={styles.inputField}
        />
        <button className={styles.loginButton} onClick={handleLogin}>
          Log in
        </button>
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        <p className={styles.continueText}>or continue with</p>
        <div className={styles.socialButtons}>
          <button className={styles.socialButtonOneID}>
            <img src={oneid} alt="OneID" /> OneID
          </button>
          <button className={styles.socialButtonQuant}>
            <img src={quant} alt="Quant" /> Quant bank account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
