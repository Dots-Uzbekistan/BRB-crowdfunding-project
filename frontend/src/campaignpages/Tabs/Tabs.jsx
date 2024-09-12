import React, { useState, useEffect } from "react";
import styles from "./Tabs.module.scss";
import Basics from "../../EachTab/Basics/Basics";
import ContactsLinks from "../../EachTab/ContactsLinks/ContactsLinks";
import Team from "../../EachTab/Team/Team";
import Pitch from "../../EachTab/Pitch/Pitch";
import Contract from "../../EachTab/Contract/Contract";
import FundingGoals from "../../EachTab/FundingGoals/FundingGoals";
import Collaboration from "../../EachTab/Collaboration/Collaboration";

const Tabs = ({ campaignId }) => {
  const [activeTab, setActiveTab] = useState("Basics");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen width is mobile-size and set the state accordingly
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Add event listener to handle window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Basics":
        return <Basics campaignId={campaignId} />;
      case "Contacts & Links":
        return <ContactsLinks campaignId={campaignId} />;
      case "Team":
        return <Team campaignId={campaignId} />;
      case "Pitch":
        return <Pitch campaignId={campaignId} />;
      case "Contract":
        return <Contract campaignId={campaignId} />;
      case "Funding Goals":
        return <FundingGoals campaignId={campaignId} />;
      case "Collaboration":
        return <Collaboration campaignId={campaignId} />;
      default:
        return <Basics campaignId={campaignId} />;
    }
  };

  const handleSelectChange = (e) => {
    setActiveTab(e.target.value);
  };

  return (
    <div className={styles.editCampaign}>
      {isMobile ? (
        <div className={styles.dropdownWrapper}>
          <select
            className={styles.dropdown}
            value={activeTab}
            onChange={handleSelectChange}
          >
            {[
              "Basics",
              "Contacts & Links",
              "Team",
              "Pitch",
              "Contract",
              "Funding Goals",
              "Collaboration",
            ].map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className={styles.tabs}>
          {[
            "Basics",
            "Contacts & Links",
            "Team",
            "Pitch",
            "Contract",
            "Funding Goals",
            "Collaboration",
          ].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
};

export default Tabs;
