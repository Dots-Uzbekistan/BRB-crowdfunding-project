import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import styles from "./CampaignGrid.module.scss";

const CampaignGrid = ({ filters, onSaveCampaign, currentCategory }) => {
  const [campaignList, setCampaignList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

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

        const campaigns = Array.isArray(response.data) ? response.data : [];
        const filteredCampaigns = filters.project_category
          ? campaigns.filter((campaign) =>
              campaign.categories.some(
                (category) =>
                  category.name.toLowerCase() ===
                  filters.project_category.toLowerCase()
              )
            )
          : campaigns;

        setCampaignList(filteredCampaigns);
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
    const fetchSavedCampaigns = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found in local storage.");
        return;
      }

      try {
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
        setError("Error fetching saved campaigns.");
      }
    };

    fetchSavedCampaigns();
  }, []);

  const handleCardClick = (campaignId) => {
    navigate(`/campaigns/${campaignId}`);
  };

  const handleSaveCampaign = async (campaign) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in local storage.");
      return;
    }

    try {
      const isAlreadySaved = savedCampaigns.some(
        (item) => item.id === campaign.id
      );

      if (!isAlreadySaved) {
        await axios.post(
          `http://161.35.19.77:8001/api/catalog/campaigns/${campaign.id}/save/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedCampaigns([...savedCampaigns, campaign]);
      } else {
        await axios.delete(
          `http://161.35.19.77:8001/api/catalog/campaigns/${campaign.id}/save/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedCampaigns(
          savedCampaigns.filter((item) => item.id !== campaign.id)
        );
      }

      if (onSaveCampaign) {
        onSaveCampaign(campaign);
      }
    } catch (error) {
      console.error("Error saving/removing campaign:", error);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const initialShowCount = 6;
  const displayedCampaigns = showAll
    ? campaignList
    : campaignList.slice(0, initialShowCount);

  const title =
    currentCategory && currentCategory !== ""
      ? `${
          currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
        } Campaigns`
      : "All Campaigns";

  return (
    <div className={styles.gridContainer}>
      {loading ? (
        <div className={styles.fullPageLoader}>
          <ThreeDots color="#4fa94d" height={80} width={80} />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className={styles.title_grid_campaigns}>
            <h1>{title}</h1>
            <p className={styles.toggleButton} onClick={toggleShowAll}>
              {showAll ? "See Less" : "See More"}
            </p>
          </div>
          {campaignList.length === 0 ? (
            <p>No campaigns available.</p>
          ) : (
            <div className={styles.grid}>
              {displayedCampaigns
                .sort((a, b) => (b.label === "Trending this week" ? 1 : -1))
                .map((campaign) => {
                  const imageUrl =
                    campaign.media && campaign.media.length > 0
                      ? campaign.media[0].file
                      : "https://via.placeholder.com/150";

                  const isSaved = savedCampaigns.some(
                    (savedCampaign) => savedCampaign.id === campaign.id
                  );

                  return (
                    <motion.div
                      key={campaign.id}
                      className={styles.campaignCard}
                      onClick={() => handleCardClick(campaign.id)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.imageWrapper}>
                        <img src={imageUrl} alt={campaign.title} />
                        {campaign.label === "Trending this week" && (
                          <div className={styles.trendingLabel}>
                            {campaign.label}
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
                          {campaign.days_left} days left |{" "}
                          {campaign.percent_raised} % funded
                        </p>
                        <div className={styles.bottomSection}>
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
                    </motion.div>
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
