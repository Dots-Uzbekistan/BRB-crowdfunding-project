import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Collaboration.module.scss";

const Collaboration = ({ campaignId }) => {
  const [recommendedCampaigns, setRecommendedCampaigns] = useState([]);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [partnerEmail, setPartnerEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedCampaigns = async () => {
      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/recommended-campaigns/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setRecommendedCampaigns(response.data);
        } else {
          console.error("API did not return an array:", response.data);
          setRecommendedCampaigns([]);
        }
      } catch (error) {
        console.error("Error fetching recommended campaigns:", error);
        setError(
          `Failed to fetch recommended campaigns: ${error.response?.status} - ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    const fetchCollaborationRequests = async () => {
      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/collaboration-request/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (Array.isArray(response.data)) {
          setCollaborationRequests(response.data);
        } else {
          console.error("API did not return an array:", response.data);
          setCollaborationRequests([]);
        }
      } catch (error) {
        console.error("Error fetching collaboration requests:", error);
        setError(
          `Failed to fetch collaboration requests: ${
            error.response?.status
          } - ${error.response?.data?.message || error.message}`
        );
      }
    };

    fetchRecommendedCampaigns();
    fetchCollaborationRequests();
  }, [campaignId]);

  const sendCollaborationRequest = async (targetCampaignId) => {
    try {
      const response = await axios.post(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/collaboration-request/`,
        { target_campaign_id: targetCampaignId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Collaboration request sent:", response.data);
    } catch (error) {
      console.error("Error sending collaboration request:", error);
      setError(
        `Failed to send collaboration request: ${error.response?.status} - ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    console.log("Send request to:", partnerEmail);
  };

  return (
    <div className={styles.collaborationContainer}>
      <h2>Collaboration</h2>

      {collaborationRequests.length > 0 ? (
        <div className={styles.existingCollaborations}>
          <h3>Your Existing Collaborations</h3>
          {collaborationRequests.map((request) => (
            <div key={request.id} className={styles.collaborationCard}>
              <p>
                <strong>From:</strong> {request.sender_campaign}
              </p>
              <p>
                <strong>To:</strong> {request.receiver_campaign}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no collaborations yet.</p>
      )}

      <div className={styles.sendRequestContainer}>
        <input
          type="email"
          placeholder="Enter the email of the partner"
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
        />
        <button onClick={handleSendRequest}>Send request</button>
      </div>

      <h3>You can collaborate with the following campaigns</h3>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.campaignGrid}>
        {Array.isArray(recommendedCampaigns) &&
          recommendedCampaigns.map((campaign) => (
            <div key={campaign.id} className={styles.campaignCard}>
              <div className={styles.trendingBadge}>Trending this week</div>
              <img src={campaign.image} alt={campaign.title} />
              <h4>{campaign.title}</h4>
              <p>{campaign.creator_name}</p>
              <button onClick={() => sendCollaborationRequest(campaign.id)}>
                Send collaboration request
              </button>
              <p>
                <strong>Reason:</strong> {campaign.collaboration_reason}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Collaboration;
