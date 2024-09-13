import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./AddCampaign.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const AddCampaign = () => {
  const [projectName, setProjectName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [campaignStats, setCampaignStats] = useState({
    total_campaigns: 0,
    total_raised: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaignStats = async () => {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      try {
        const response = await axios.get(
          "http://161.35.19.77:8001/api/founder/campaigns/creation-stats/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { total_campaigns = 0, total_raised = 0 } = response.data || {};
        setCampaignStats({
          total_campaigns: total_campaigns || 0,
          total_raised: total_raised || 0,
        });
      } catch (error) {
        console.error("Error fetching campaign stats", error);
        // In case of an error, keep the values as 0
        setCampaignStats({ totalCampaigns: 0, totalRaised: 0 });
      }
    };

    fetchCampaignStats();
  }, []);

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
    <motion.div
      className={`${styles.alert} ${styles[type]}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={handleCloseAlert}>
        &times;
      </button>
    </motion.div>
  );

  return (
    <div className={styles.wrapper_add_campaign}>
      <Navbar />
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.left_cont}>
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Let your community <br /> invest in your ideas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Raise money from hundreds of <br /> customers, fans, and friends—all
            <br />
            in one line on your cap table
          </motion.p>
          <motion.div
            className={styles.input_getstarted}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className={styles.name_project}>
              <label htmlFor="projectName">Project name</label>
              <input
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={handleInputChange}
              />
            </div>
            <motion.button
              className={styles.btn_getstarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          className={styles.right_green}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <p>
            {campaignStats.total_campaigns} campaigns <br /> already raised
          </p>
          <div>
            <h2>{campaignStats.total_raised}</h2>
            <p>in our platform</p>
          </div>
        </motion.div>
      </motion.div>

      {showAlert && (
        <Alert type="warning" message="Please enter a project name." />
      )}
    </div>
  );
};

export default AddCampaign;
