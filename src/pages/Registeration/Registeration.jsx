import React, { useState } from "react";
import axios from "axios";
import styles from "./Registeration.module.scss";
import LoginNavbar from "../../subcomponents/LoginNavbar/LoginNavbar";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Registeration = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");
  const [isValidLength, setIsValidLength] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");

  const evaluatePasswordStrength = (password) => {
    let strengthLevel = 0;

    const isLengthValid = password.length >= 8 && password.length <= 12;
    setIsValidLength(isLengthValid);

    if (isLengthValid) {
      if (password.length >= 8) strengthLevel++;
      if (password.length >= 12) strengthLevel++;

      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (hasLetters && hasNumbers) strengthLevel++;
      if (hasLetters && hasNumbers && hasSpecialChars) strengthLevel++;
    }

    setStrength(strengthLevel);

    switch (strengthLevel) {
      case 1:
        setStrengthLabel("easy");
        break;
      case 2:
        setStrengthLabel("normal");
        break;
      case 3:
        setStrengthLabel("good");
        break;
      case 4:
        setStrengthLabel("strong");
        break;
      default:
        setStrengthLabel("");
        break;
    }
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePasswordStrength(newPassword);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      emailRegex.test(email) &&
      (email.endsWith("@gmail.com") || email.includes("@"))
    );
  };

  const handleSubmit = async () => {
    if (!email || !fullName || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (!isValidLength) {
      alert("Password must be between 8 and 12 characters.");
      return;
    }

    const userData = {
      email,
      full_name: fullName,
      password,
    };

    try {
      const response = await axios.post(
        "https://77aa-31-148-166-245.ngrok-free.app/api/auth/register/",
        userData
      );
      console.log("Success:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        const errorData = error.response.data;
        if (errorData) {
          for (const [field, messages] of Object.entries(errorData)) {
            console.error(`${field}: ${messages.join(", ")}`);
          }
        }
        alert("Registration failed. Please check your input and try again.");
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Network error. Please try again later.");
      } else {
        console.error("Error message:", error.message);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };
  return (
    <section className={styles.wrapper_registeration}>
      <LoginNavbar />
      <div className={styles.registeration_main}>
        <div className={styles.registeration_text}>
          <h1>Invest in the founders you believe in</h1>
          <h3>Join over 1 million investors who are funding the future</h3>
        </div>
      </div>
      <div className={styles.wrapper_inputs}>
        <div className={styles.ready_logins}>
          <button>
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_7_1517)">
                <path
                  d="M22.776 11.7649C22.776 10.9832 22.7126 10.1972 22.5774 9.42816H11.7302V13.8566H17.9419C17.6841 15.2849 16.8559 16.5483 15.6431 17.3512V20.2246H19.349C21.5252 18.2217 22.776 15.2637 22.776 11.7649Z"
                  fill="#4285F4"
                />
                <path
                  d="M11.7301 23.0008C14.8317 23.0008 17.4473 21.9824 19.3531 20.2246L15.6472 17.3512C14.6161 18.0526 13.2851 18.4498 11.7343 18.4498C8.7341 18.4498 6.19028 16.4257 5.27755 13.7045H1.45337V16.6666C3.4056 20.5499 7.3819 23.0008 11.7301 23.0008Z"
                  fill="#34A853"
                />
                <path
                  d="M5.27349 13.7044C4.79177 12.2762 4.79177 10.7296 5.27349 9.30136V6.3392H1.45354C-0.177547 9.5887 -0.177547 13.4171 1.45354 16.6666L5.27349 13.7044Z"
                  fill="#FBBC04"
                />
                <path
                  d="M11.7301 4.55176C13.3696 4.5264 14.9542 5.14334 16.1416 6.27581L19.4249 2.99251C17.3459 1.04028 14.5866 -0.0330299 11.7301 0.000774972C7.3819 0.000774972 3.4056 2.45163 1.45337 6.33919L5.27332 9.30134C6.18183 6.57583 8.72987 4.55176 11.7301 4.55176Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_7_1517">
                  <rect width="23" height="23" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Continue with Google
          </button>
          <button>Continue with OneID</button>
          <button>
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="7.45651"
                stroke="black"
                stroke-width="6.08696"
              />
              <circle cx="19.5001" cy="20.5" r="2.5" fill="#E30016" />
            </svg>
            Continue with Quant
          </button>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.type_inputs}>
          <input
            type="email"
            placeholder="Email: @gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className={styles.passwordStrengthIndicator}>
            <div className={styles.inputWrapper}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={handleChange}
                placeholder="Password"
                className={styles.inputField}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.eyeIcon}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={styles.strengthMeter}>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`${styles.strengthBar} ${
                    strength >= level ? styles.active : ""
                  }`}
                ></div>
              ))}
            </div>
            {password && (
              <p className={styles.strengthLabel}>{strengthLabel}</p>
            )}
            {!isValidLength && (
              <p className={styles.errorText}>
                Password must be between 8 and 12 characters.
              </p>
            )}
          </div>
          <button onClick={handleSubmit} className={styles.btn_signup}>
            Sign up
          </button>
        </div>
      </div>
      <p className={styles.linktoregister}>
        Already have an account? <Link>Login in here</Link>
      </p>
    </section>
  );
};

export default Registeration;
