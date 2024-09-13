import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import styles from "./Collaboration.module.scss";

const Collaboration = ({ campaignId }) => {
  const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collabLoading, setCollabLoading] = useState({}); // Loading state for each button

  useEffect(() => {
    fetchRecommendedCampaigns();
  }, [campaignId]);

  const fetchRecommendedCampaigns = async (query = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/recommended-campaigns/`,
        {
          params: { search: query },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRecommendedCampaigns(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching recommended campaigns:", error);
      setError(
        `Failed to fetch campaigns: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchRecommendedCampaigns(e.target.value);
  };

  const sendCollaborationRequest = async (targetCampaignId) => {
    setCollabLoading((prev) => ({ ...prev, [targetCampaignId]: true })); // Set loading state for specific campaign ID
    try {
      const response = await axios.post(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/collaboration-request/`,
        { target_campaign_id: targetCampaignId }, // Request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", // Ensure correct content type
          },
        }
      );
      console.log("Collaboration request sent:", response.data);
      alert("Your collaboration request has been sent successfully!");
    } catch (error) {
      console.error("Error sending collaboration request:", error);
      console.error("Response data:", error.response?.data); // Log response data
      console.error("Response status:", error.response?.status); // Log response status
      alert(
        `Failed to send collaboration request: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setCollabLoading((prev) => ({ ...prev, [targetCampaignId]: false })); // Set loading state to false for specific campaign ID
    }
  };

  return (
    <motion.div
      className={styles.collaborationContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Collaborate with Other Campaigns</h2>

      <div className={styles.searchContainer}>
        <motion.input
          type="text"
          placeholder="Search campaigns by title"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchInput}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            duration: 0.5,
          }}
          whileFocus={{ boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)", scale: 1.02 }}
        />
      </div>

      {loading ? (
        <div className={styles.loader}>
          <ThreeDots height="80" width="80" color="#4fa94d" />
          <p>AI is generating campaign suggestions...</p>
        </div>
      ) : (
        <>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {recommendedCampaigns.length > 0 ? (
            <div className={styles.campaignGrid}>
              {recommendedCampaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  className={styles.campaignCard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={styles.trendingBadge}>AI Suggested</div>
                  <img
                    src={campaign.image || "/placeholder.png"}
                    alt={campaign.title}
                    className={styles.campaignImage}
                  />
                  <h4>{campaign.title}</h4>
                  <p>By {campaign.creator_name}</p>
                  <p className={styles.match_percentage}>
                    Matching Percentage: {campaign.matching_percentage}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className={styles.collaborateButton}
                    onClick={() => sendCollaborationRequest(campaign.id)}
                    disabled={collabLoading[campaign.id]} // Disable button while loading for specific campaign ID
                  >
                    {collabLoading[campaign.id]
                      ? "Sending..."
                      : "Send Collaboration Request"}
                  </motion.button>
                  <div className={styles.overlay}>
                    <p>
                      Reason for Collaboration:{" "}
                      {campaign.collaboration_reason || "No reason provided"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p>No campaigns found. Try searching with different terms.</p>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Collaboration;
