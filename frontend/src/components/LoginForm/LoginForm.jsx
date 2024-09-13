import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import styles from "./LoginForm.module.scss";
import oneid from "../../assets/oneid.png";
import quant from "../../assets/quant.png";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(null);
  const navigate = useNavigate();

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
    setIsPasswordCorrect(null);

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
      setIsPasswordCorrect(false);
      if (error.response && error.response.data?.message) {
        if (error.response.data.message === "Incorrect password") {
          setErrorMessage("Password is not correct");
        } else {
          setErrorMessage("Login failed: " + error.response.data.message);
        }
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.welcome}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          Welcome Back to <span className={styles.highlightYellow}>Your</span>{" "}
          Dreams!
        </h1>
        <p>
          Let's continue your journey towards <br /> success. We’re glad to have
          you!
        </p>
      </motion.div>
      <motion.div
        className={styles.form}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className={`${styles.inputField} ${
            isPasswordCorrect === false ? styles.incorrect : ""
          }`}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          className={`${styles.inputField} ${
            isPasswordCorrect === false ? styles.incorrect : ""
          }`}
        />
        <button
          type="submit"
          className={styles.loginButton}
          onClick={handleLogin}
        >
          Log in
        </button>
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        {isPasswordCorrect === false && (
          <p className={styles.registerText}>
            Don't have an account?
            <Link to="/lastregistration" className={styles.registerLink}>
              Create a new one
            </Link>
          </p>
        )}
        <p className={styles.continueText}>or continue with</p>
        <div className={styles.socialButtons}>
          <button className={styles.socialButtonOneID}>
            <img src={oneid} alt="OneID" /> OneID
          </button>
          <button className={styles.socialButtonQuant}>
            <img src={quant} alt="Quant" /> Quant bank account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
