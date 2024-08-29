import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import styles from "./CampaignGrid.module.scss";

const CampaignGrid = ({ filters, onSaveCampaign }) => {
  const [campaignList, setCampaignList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/campaigns/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found in local storage.");
        setLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams();

        if (filters.sort) queryParams.append("sort", filters.sort);
        if (filters.goal_amount)
          queryParams.append("goal_amount", filters.goal_amount);
        if (filters.funding_status)
          queryParams.append("funding_status", filters.funding_status);
        if (filters.project_state)
          queryParams.append("project_state", filters.project_state);
        if (filters.raised_percentage)
          queryParams.append("raised_percentage", filters.raised_percentage);

        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCampaignList(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setError("Error fetching campaigns.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

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

    if (onSaveCampaign) {
      onSaveCampaign(campaign);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const initialShowCount = 6;
  const displayedCampaigns = showAll
    ? campaignList
    : campaignList.slice(0, initialShowCount);

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        <div className={styles.fullPageLoader}>
          <ThreeDots color="#A5FFB8" height={80} width={80} />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className={styles.title_grid_campaigns}>
            <h1>Trending Technology Campaigns</h1>
            <p className={styles.toggleButton} onClick={toggleShowAll}>
              {showAll ? "See Less" : "See More"}
            </p>
          </div>
          {campaignList.length === 0 ? (
            <p>No campaigns available.</p>
          ) : (
            <div className={styles.grid}>
              {displayedCampaigns.map((campaign) => {
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
                  <div
                    key={campaign.id}
                    className={styles.campaignCard}
                    onClick={() => handleCardClick(campaign.id)}
                  >
                    <div className={styles.imageWrapper}>
                      <img src={imageUrl} alt={campaign.title} />
                      <div className={styles.trendingLabel}>
                        Trending this week
                      </div>
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
                        {campaign.percent_raised}% funded
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveCampaign(campaign);
                          }}
                        >
                          {isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignGrid;
