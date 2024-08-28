import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./CampaignDetail.module.scss";

const CampaignDetail = () => {
  const { id } = useParams(); // Get the campaign ID from the URL params
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/${id}/`
        );
        if (response.status === 200) {
          setCampaign(response.data);
        } else {
          setError(`API returned status code ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError("Error fetching campaign details.");
      }
    };

    fetchCampaignDetail();
  }, [id]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!campaign) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.campaignDetailContainer}>
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
  );
};

export default CampaignDetail;
