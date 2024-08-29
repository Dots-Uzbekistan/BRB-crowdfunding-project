import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProfileMiniDashboard.module.scss";

const ProfileMiniDashboard = () => {
  const [totalInvested, setTotalInvested] = useState("$0.00");
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalInvested = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://161.35.19.77:8001/api/investments/dashboard/last-30-days/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTotalInvested(response.data.total_invested);
        } else {
          setError("No token found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching total invested amount:", error);
        setError("Failed to fetch total invested amount.");
      }
    };

    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://161.35.19.77:8001/api/investments/dashboard/updates/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUpdates(response.data);
        } else {
          setError("No token found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching updates:", error);
        setError("Failed to fetch updates.");
      }
    };

    fetchTotalInvested();
    fetchUpdates();
  }, []);

  return (
    <div className={styles.profileMiniDashboard}>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className={styles.dashboardContent}>
          <div className={styles.totalInvested}>
            <p>
              In the last 30 <br /> days in total <br /> you invested
            </p>
            <h1>{totalInvested}</h1>
          </div>
          <div className={styles.updatesSection}>
            <div className={styles.updatesHeader}>
              <h3>Updates</h3>
              <span>+{updates.length}</span>
            </div>
            <ul className={styles.updatesList}>
              {updates.map((update, index) => (
                <li key={index} className={styles.updateItem}>
                  <div className={styles.updateIcon}></div>
                  <div className={styles.updateDetails}>
                    <h2>{update.campaign_name}</h2>
                    <p>{update.title}</p>
                  </div>
                  <span className={styles.updateBadge}>1</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMiniDashboard;
