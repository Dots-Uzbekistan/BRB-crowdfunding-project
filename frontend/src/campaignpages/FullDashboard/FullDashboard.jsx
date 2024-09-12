import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./FullDashboard.module.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
const FullDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(0); // Default to Step 1
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://161.35.19.77:8001/api/founder/campaigns/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  const handleAccordionClick = (index) => {
    setActiveAccordion(index);
  };

  const handleEditClick = () => {
    if (selectedCampaign) {
      navigate(`/editcampaign/${selectedCampaign}`);
    }
  };
  const getNextStep = () => {
    return activeAccordion < 5 ? activeAccordion + 1 : null;
  };

  return (
    <div className={styles.wrapper_fulldashboard}>
      <Navbar />
      <div className={styles.wrapper_content_dashboard}>
        <nav className={styles.nav_campaign_dashboard}>
          <select
            className={styles.select_option}
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>

          <div className={styles.link_dashboard_campaign}>
            <Link
              className={
                selectedCampaign ? styles.link_dashboard : styles.link_disabled
              }
              to={selectedCampaign ? `/update/${selectedCampaign}` : "#"}
            >
              Post Update
            </Link>

            <Link
              className={
                selectedCampaign ? styles.link_dashboard : styles.link_disabled
              }
              to={selectedCampaign ? `/stats/${selectedCampaign}` : "#"}
            >
              View Stats
            </Link>

            <Link
              className={
                selectedCampaign ? styles.link_dashboard : styles.link_disabled
              }
              to={selectedCampaign ? `/editcampaign/${selectedCampaign}` : "#"}
            >
              Edit Campaign
            </Link>
          </div>
        </nav>

        <div className={styles.accordion_item}>
          <div
            className={styles.accordion_header}
            onClick={() => handleAccordionClick(0)}
          >
            <h1>Step 1: Campaign Preparation</h1>

            <div className={styles.status}>
              {activeAccordion === 0 && (
                <div className={styles.inProgressSection}>
                  <h3>In Progress</h3>
                </div>
              )}
              <span>
                {activeAccordion === 0 ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
          <div
            className={styles.accordion_content}
            style={{
              display: activeAccordion === 0 ? "block" : "none",
            }}
          >
            <p>
              It is time to prepare your campaign <br /> for screening before
              publication
            </p>
            {activeAccordion === 0 && (
              <button
                className={styles.button}
                onClick={() => handleEditClick(selectedCampaign)}
              >
                Edit Campaign
              </button>
            )}
          </div>
        </div>
        {/* */}
        <div className={styles.accordion_item}>
          <div
            className={styles.accordion_header}
            onClick={() => handleAccordionClick(2)}
          >
            <h1>Step 2: Screening</h1>
            <div className={styles.status}>
              {activeAccordion === 2 && (
                <div className={styles.inProgressSection}>
                  <h3>In Progress</h3>
                </div>
              )}
              <span>
                {activeAccordion === 2 ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
          <div
            className={styles.accordion_content}
            style={{
              display: activeAccordion === 2 ? "block" : "none",
            }}
          >
            <div className={styles.additionalContent}></div>
            {activeAccordion === 2 && (
              <button
                className={styles.button}
                onClick={() => handleEditClick(selectedCampaign)}
              >
                Edit Campaign
              </button>
            )}
          </div>
        </div>
        {activeAccordion === 2 && getNextStep() !== null && (
          <div className={styles.nextStepSection}>
            <h3>Next Step</h3>
          </div>
        )}
        {/* */}
        {/* */}
        <div className={styles.accordion_item}>
          <div
            className={styles.accordion_header}
            onClick={() => handleAccordionClick(3)}
          >
            <h1>Step 3: Approval and Legal part</h1>
            <div className={styles.status}>
              {activeAccordion === 3 && (
                <div className={styles.inProgressSection}>
                  <h3>In Progress</h3>
                </div>
              )}
              <span>
                {activeAccordion === 3 ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
          <div
            className={styles.accordion_content}
            style={{
              display: activeAccordion === 3 ? "block" : "none",
            }}
          >
            <div className={styles.additionalContent}></div>
            {activeAccordion === 3 && (
              <button
                className={styles.button}
                onClick={() => handleEditClick(selectedCampaign)}
              >
                Edit Campaign
              </button>
            )}
          </div>
        </div>
        {activeAccordion === 3 && getNextStep() !== null && (
          <div className={styles.nextStepSection}>
            <h3>Next Step</h3>
          </div>
        )}
        {/* */}
        {/* */}
        <div className={styles.accordion_item}>
          <div
            className={styles.accordion_header}
            onClick={() => handleAccordionClick(4)}
          >
            <h1>Step 4: Approval and Legal part</h1>
            <div className={styles.status}>
              {activeAccordion === 4 && (
                <div className={styles.inProgressSection}>
                  <h3>In Progress</h3>
                </div>
              )}
              <span>
                {activeAccordion === 4 ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
          <div
            className={styles.accordion_content}
            style={{
              display: activeAccordion === 4 ? "block" : "none",
            }}
          >
            <div className={styles.additionalContent}></div>
            {activeAccordion === 4 && (
              <button
                className={styles.button}
                onClick={() => handleEditClick(selectedCampaign)}
              >
                Edit Campaign
              </button>
            )}
          </div>
        </div>
        {activeAccordion === 4 && getNextStep() !== null && (
          <div className={styles.nextStepSection}>
            <h3>Next Step</h3>
          </div>
        )}
        {/* */}
        {/* */}
        <div className={styles.accordion_item}>
          <div
            className={styles.accordion_header}
            onClick={() => handleAccordionClick(5)}
          >
            <h1>Step 5: End of campaign and Funding</h1>
            <div className={styles.status}>
              {activeAccordion === 5 && (
                <div className={styles.inProgressSection}>
                  <h3>In Progress</h3>
                </div>
              )}
              <span>
                {activeAccordion === 5 ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
          <div
            className={styles.accordion_content}
            style={{
              display: activeAccordion === 5 ? "block" : "none",
            }}
          >
            <div className={styles.additionalContent}></div>
            {activeAccordion === 5 && (
              <button
                className={styles.button}
                onClick={() => handleEditClick(selectedCampaign)}
              >
                Edit Campaign
              </button>
            )}
          </div>
        </div>
        {activeAccordion === 5 && getNextStep() !== null && (
          <div className={styles.nextStepSection}>
            <h3>Next Step</h3>
          </div>
        )}
        {/* */}
      </div>
    </div>
  );
};

export default FullDashboard;
