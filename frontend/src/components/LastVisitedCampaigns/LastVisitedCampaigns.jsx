import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import styles from "./LastVisitedCampaigns.module.scss";

const LastVisitedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          "http://161.35.19.77:8001/api/catalog/campaigns/last-visited/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setCampaigns(Array.isArray(response.data) ? response.data : []);
        } else {
          setError(`API returned status code ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setError("Error fetching campaigns.");
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchSavedCampaigns = () => {
      const saved = JSON.parse(localStorage.getItem("savedCampaigns")) || [];
      setSavedCampaigns(saved);
    };

    fetchSavedCampaigns();
  }, []);

  const handleSaveCampaign = (campaign) => {
    const saved = JSON.parse(localStorage.getItem("savedCampaigns")) || [];
    const isAlreadySaved = saved.some((item) => item.id === campaign.id);

    if (!isAlreadySaved) {
      saved.push(campaign);
      localStorage.setItem("savedCampaigns", JSON.stringify(saved));
      setSavedCampaigns(saved);
    } else {
      const updatedSaved = saved.filter((item) => item.id !== campaign.id);
      localStorage.setItem("savedCampaigns", JSON.stringify(updatedSaved));
      setSavedCampaigns(updatedSaved);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Last Visited Campaigns</h1>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : Array.isArray(campaigns) && campaigns.length > 0 ? (
        <div className={styles.grid}>
          {campaigns.map((campaign) => {
            const imageUrl =
              campaign.media && campaign.media.length > 0
                ? campaign.media[0].file
                : "https://via.placeholder.com/150";

            const ratings = campaign.ratings || [];
            const averageRating =
              ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                ratings.length || 0;

            const isSaved = savedCampaigns.some(
              (savedCampaign) => savedCampaign.id === campaign.id
            );

            return (
              <div key={campaign.id} className={styles.campaignCard}>
                <div className={styles.imageWrapper}>
                  <img src={imageUrl} alt={campaign.title} />
                  {campaign.tags && campaign.tags.length > 0 && (
                    <div className={styles.trendingLabel}>
                      {campaign.tags.map((tag) => tag.name).join(", ")}
                    </div>
                  )}
                  <div className={styles.hoverOverlay}>
                    {campaign.description}
                    <div className={styles.btn_overlay}>
                      {campaign.tags.map((tag) => (
                        <button key={tag.id} className="tag-button">
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.campaignDetails}>
                  <h4>{campaign.title}</h4>
                  <p>{campaign.location}</p>
                  <p>
                    {campaign.days_left} days left •{" "}
                    {campaign.percentage_funded}% funded
                  </p>
                  <div className={styles.bottomSection}>
                    <StarRatings
                      rating={averageRating}
                      starRatedColor="gold"
                      starEmptyColor="gray"
                      numberOfStars={5}
                      name="rating"
                      starDimension="20px"
                      starSpacing="1px"
                    />
                    <button
                      className={styles.saveButton}
                      onClick={() => handleSaveCampaign(campaign)}
                    >
                      {isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No campaigns available.</p>
      )}
    </div>
  );
};

export default LastVisitedCampaigns;
