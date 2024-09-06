import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import styles from "./SavedCampaigns.module.scss";

const SavedCampaigns = () => {
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchSavedCampaigns = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found in local storage.");

        const response = await axios.get(
          "http://161.35.19.77:8001/api/users/saved-campaigns/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedCampaigns(response.data || []);
      } catch (error) {
        console.error("Error fetching saved campaigns:", error);
      }
    };

    fetchSavedCampaigns();
  }, []);

  const handleRemoveCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in local storage.");

      await axios.post(
        `http://161.35.19.77:8001/api/catalog/campaigns/${campaignId}/save/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedCampaigns = savedCampaigns.filter(
        (campaign) => campaign.id !== campaignId
      );
      setSavedCampaigns(updatedCampaigns);
    } catch (error) {
      console.error("Error removing campaign:", error);
    }
  };

  const displayedCampaigns = showAll
    ? savedCampaigns
    : savedCampaigns.slice(0, 4);

  return (
    <div className={styles.wrapper_saved}>
      <div className={styles.title_saved}>
        <h1>Saved Campaigns</h1>

        {savedCampaigns.length > 4 && (
          <p
            className={styles.toggleButton}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "See All"}
          </p>
        )}
      </div>
      <div className={styles.savedContainer}>
        {displayedCampaigns.length > 0 ? (
          displayedCampaigns.map((campaign) => {
            const imageUrl =
              campaign.campaign_image || "https://via.placeholder.com/150";

            return (
              <div
                key={campaign.campaign_title}
                className={styles.campaignCard}
              >
                <div className={styles.imageWrapper}>
                  <img src={imageUrl} alt={campaign.campaign_title} />
                </div>
                <div className={styles.campaignDetails}>
                  <h4>{campaign.campaign_title}</h4>
                  <p>{campaign.creator_name}</p>
                  <p>
                    {campaign.days_left} days left • {campaign.percent_funded} %
                    funded
                  </p>
                  <div className={styles.bottomSection}>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveCampaign(campaign.id)}
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No saved campaigns.</p>
        )}
      </div>
    </div>
  );
};

export default SavedCampaigns;
