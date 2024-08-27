import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./LoginForm.module.scss";
import oneid from "../../assets/oneid.png";
import quant from "../../assets/quant.png";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Check for an existing token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setErrorMessage("");

    const requestBody = {
      username,
      password,
    };

    try {
      const response = await axios.post(
        "http://161.35.19.77:8001/api/auth/login/",
        requestBody
      );

      const { access } = response.data;

      if (access) {
        localStorage.setItem("token", access);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        setErrorMessage("Login failed: " + error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
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
        <button type="submit" className={styles.loginButton} onClick={handleLogin}>
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
