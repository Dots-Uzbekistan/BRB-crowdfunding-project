import React, { useState } from "react";
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

  return (
    <div className={styles.editCampaign}>
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

      <div className={styles.tabContent}>{renderTabContent()}</div>
    </div>
  );
};

export default Tabs;
