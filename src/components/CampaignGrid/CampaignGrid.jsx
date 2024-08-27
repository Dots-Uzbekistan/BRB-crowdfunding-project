import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CampaignGrid.module.scss";

const CampaignGrid = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Retrieve token from local storage
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`http://161.35.19.77:8001/api/catalog/campaigns`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // Handle the API response
          console.log("API response:", response.data);
          setCampaigns(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error fetching campaigns:", error);
          setError("Error fetching campaigns.");
        });
    } else {
      console.error("No token found in local storage");
      setError("No token found in local storage.");
    }
  }, []);

  return (
    <div className={styles.gridContainer}>
      {error ? (
        <p>{error}</p>
      ) : Array.isArray(campaigns) && campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id} className={styles.campaignCard}>
            <div className={styles.imageWrapper}>
              <img src={campaign.image} alt={campaign.title} />
              <div className={styles.trendingLabel}>Trending this week</div>
            </div>
            <div className={styles.campaignDetails}>
              <h3>{campaign.title}</h3>
              <p>{campaign.creator_name}</p>
              <p>
                {campaign.days_left} days left • {campaign.percentage_funded}%
                funded
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No campaigns available.</p>
      )}
    </div>
  );
};

export default CampaignGrid;
