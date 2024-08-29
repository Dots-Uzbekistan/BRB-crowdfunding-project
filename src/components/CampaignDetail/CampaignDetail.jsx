import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import styles from "./CampaignDetail.module.scss";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setCampaign(response.data);
        } else {
          setError(`API returned status code ${response.status}`);
        }
      } catch (err) {
        if (err.response) {
          console.error("Error response data:", err.response.data);
          setError(
            `Error: ${err.response.data.detail || "Something went wrong."}`
          );
        } else if (err.request) {
          console.error("Error request data:", err.request);
          setError("Error: No response from server.");
        } else {
          console.error("Error message:", err.message);
          setError("Error: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!campaign) {
    return <p>No campaign details available.</p>;
  }

  return (
    <section className={styles.campaignDetailContainer}>
      <Navbar />
      <div>
        <h1>{campaign.title}</h1>
        {campaign.media && campaign.media[0]?.file && (
          <img src={campaign.media[0].file} alt={campaign.title} />
        )}
        <p>{campaign.description}</p>
        <p>Location: {campaign.location}</p>
        <p>
          Goal Amount: {campaign.currency} {campaign.goal_amount}
        </p>
        <p>
          Raised Amount: {campaign.currency} {campaign.raised_amount}
        </p>
        <p>Funding Status: {campaign.funding_status}</p>
        <p>Project State: {campaign.project_state}</p>
        <div>
          <h3>Tags:</h3>
          {campaign.tags &&
            campaign.tags.map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.name}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CampaignDetail;
