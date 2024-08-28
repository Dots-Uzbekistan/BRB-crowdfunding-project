import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { AiFillDelete } from "react-icons/ai";
import styles from "./SavedCampaigns.module.scss"; // Ensure this file has the same styles as CampaignGrid

const SavedCampaigns = () => {
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to toggle view

  useEffect(() => {
    const fetchSavedCampaigns = () => {
      const savedCampaigns =
        JSON.parse(localStorage.getItem("savedCampaigns")) || [];
      setSavedCampaigns(savedCampaigns);
    };

    fetchSavedCampaigns();
  }, []);

  const handleRemoveCampaign = (campaignId) => {
    const updatedCampaigns = savedCampaigns.filter(
      (campaign) => campaign.id !== campaignId
    );
    localStorage.setItem("savedCampaigns", JSON.stringify(updatedCampaigns));
    setSavedCampaigns(updatedCampaigns);
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
              campaign.media && campaign.media.length > 0
                ? campaign.media[0].file
                : "https://via.placeholder.com/150"; // Default image if none is available

            const ratings = campaign.ratings || [];
            const averageRating =
              ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                ratings.length || 0;

            return (
              <div key={campaign.id} className={styles.campaignCard}>
                <div className={styles.imageWrapper}>
                  <img src={imageUrl} alt={campaign.title} />
                  <div className={styles.trendingLabel}>Trending this week</div>
                  <div className={styles.hoverOverlay}>
                    {campaign.description}
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
