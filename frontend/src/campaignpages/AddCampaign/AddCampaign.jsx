import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./AddCampaign.module.scss";
import { Link, useNavigate } from "react-router-dom";

const AddCampaign = () => {
  const [projectName, setProjectName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleGetStarted = () => {
    if (projectName.trim()) {
      localStorage.setItem("projectName", projectName);
      navigate("/firstadditioncampaign");
    } else {
      setShowAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const Alert = ({ message, type }) => (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={handleCloseAlert}>
        &times;
      </button>
    </div>
  );

  return (
    <div className={styles.wrapper_add_campaign}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.left_cont}>
          <h1>
            Let your community <br /> invest in your ideas
          </h1>
          <p>
            Raise money from hundreds of <br /> customers, fans, and friends—all
            <br />
            in one line on your cap table
          </p>
          <div className={styles.input_getstarted}>
            <div className={styles.name_project}>
              <label htmlFor="projectName">Project name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={handleInputChange}
              />
            </div>
            <button
              className={styles.btn_getstarted}
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
        <div className={styles.right_green}>
          <p>
            1,247 campaigns <br /> already raised
          </p>
          <div>
            <h2>$300k</h2>
            <p>in our platform</p>
          </div>
        </div>
      </div>

      {showAlert && (
        <Alert type="warning" message="Please enter a project name." />
      )}
    </div>
  );
};

export default AddCampaign;
