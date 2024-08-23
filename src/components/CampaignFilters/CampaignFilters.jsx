import React, { useState, useEffect } from "react";
import axios from "axios";

const CampaignsFilters = ({ filters }) => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const queryParams = new URLSearchParams(filters).toString();
      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/catalog/campaigns/?${queryParams}`
        );
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, [filters]);

  return (
    <div>
      {/* Render filtered campaigns */}
      {Array.isArray(campaigns) && campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id}>
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <img src={campaign.media[0]?.file} alt={campaign.title} />
            <p>{campaign.location}</p>
            <p>
              Goal: {campaign.goal_amount} {campaign.currency}
            </p>
            <p>
              Raised: {campaign.raised_amount} {campaign.currency}
            </p>
            <p>Status: {campaign.funding_status}</p>
            <p>Project State: {campaign.project_state}</p>
          </div>
        ))
      ) : (
        <p>No campaigns found.</p>
      )}
    </div>
  );
};

export default CampaignsFilters;
