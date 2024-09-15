import React, { useState, useEffect } from "react";
import styles from "./Tabs.module.scss";
import Basics from "../../EachTab/Basics/Basics";
import ContactsLinks from "../../EachTab/ContactsLinks/ContactsLinks";
import Team from "../../EachTab/Team/Team";
import Pitch from "../../EachTab/Pitch/Pitch";
import Contract from "../../EachTab/Contract/Contract";
import FundingGoals from "../../EachTab/FundingGoals/FundingGoals";
import Collaboration from "../../EachTab/Collaboration/Collaboration";
import { ThreeDots } from "react-loader-spinner";
import { FaCheckCircle } from "react-icons/fa";

const Tabs = ({ campaign, registrationSteps }) => {
  const [activeTab, setActiveTab] = useState("Basics");
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedTabs, setCompletedTabs] = useState({
    Basics: false,
    "Contacts & Links": false,
    Team: false,
    Pitch: false,
    Contract: false,
    "Funding Goals": false,
    Collaboration: false,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (campaign) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [campaign]);

  useEffect(() => {
    if (registrationSteps) {
      setCompletedTabs({
        Basics: registrationSteps.step_1,
        "Contacts & Links": registrationSteps.step_2,
        Team: registrationSteps.step_3,
        Pitch: registrationSteps.step_4,
        Contract: registrationSteps.step_5,
        "Funding Goals": false,
        Collaboration: false,
      });
    }
  }, [registrationSteps]);

  const renderTabContent = () => {
    const campaignId = campaign?.id;

    const handleTabComplete = (tabName) => {
      setCompletedTabs((prevState) => ({
        ...prevState,
        [tabName]: true,
      }));
    };

    switch (activeTab) {
      case "Basics":
        return (
          <Basics
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Basics")}
          />
        );
      case "Contacts & Links":
        return (
          <ContactsLinks
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Contacts & Links")}
          />
        );
      case "Team":
        return (
          <Team
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Team")}
          />
        );
      case "Pitch":
        return (
          <Pitch
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Pitch")}
          />
        );
      case "Contract":
        return (
          <Contract
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Contract")}
          />
        );
      case "Funding Goals":
        return (
          <FundingGoals
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Funding Goals")}
          />
        );
      case "Collaboration":
        return (
          <Collaboration
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Collaboration")}
          />
        );
      default:
        return (
          <Basics
            campaignId={campaignId}
            onComplete={() => handleTabComplete("Basics")}
          />
        );
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
            {Object.keys(completedTabs).map((tab) => (
              <option key={tab} value={tab}>
                {completedTabs[tab] && (
                  <FaCheckCircle className={styles.tickIcon} />
                )}{" "}
                {tab}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className={styles.tabs}>
          {Object.keys(completedTabs).map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {completedTabs[tab] && (
                <FaCheckCircle className={styles.tickIcon} />
              )}
            </button>
          ))}
        </div>
      )}

      <div className={styles.tabContent}>
        {loading ? (
          <div className={styles.loader}>
            <ThreeDots color="#00BFFF" height={80} width={80} />
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
};

export default Tabs;
