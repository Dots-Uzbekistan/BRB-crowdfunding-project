import React, { useEffect, useState } from "react";
import styles from "./CampaignGrid.module.scss";

const CampaignGrid = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Replace 'authToken' with the actual key name
    const token = localStorage.getItem("authToken");

    console.log("Retrieved token:", token); // Should not be null

    if (token) {
      fetch("http://161.35.19.77:8001/api/catalog/campaigns/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data);
          setCampaigns(Array.isArray(data) ? data : []);
        })
        .catch((error) => console.error("Error fetching campaigns:", error));
    } else {
      console.error("No token found in local storage");
    }
  }, []);

  return (
    <div className={styles.gridContainer}>
      {Array.isArray(campaigns) && campaigns.length > 0 ? (
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
