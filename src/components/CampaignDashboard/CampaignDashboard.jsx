import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CampaignDashboard.module.scss";
import Navbar from "../Navbar/Navbar";
import { FaPen } from "react-icons/fa";
import { RiSettingsLine } from "react-icons/ri";
import { FaBook } from "react-icons/fa6";
import { FaLeaf } from "react-icons/fa";
import { MdOutlineSportsBasketball } from "react-icons/md";
import { AiTwotoneMedicineBox } from "react-icons/ai";

const CampaignDashboard = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [raisedAmount, setRaisedAmount] = useState("<10mln");
  const [goalAmount, setGoalAmount] = useState("<10mln");
  const [fundingState, setFundingState] = useState("live");
  const [currency, setCurrency] = useState("uzs");
  const [projectState, setProjectState] = useState("production");
  const [raisedPercentage, setRaisedPercentage] = useState("<75%");
  const renderRadioGroup = (name, options, selectedValue, setSelectedValue) => (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioOption}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => setSelectedValue(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselItems = [
    { icon: <FaPen />, text: "Art & Crafts" },
    { icon: <RiSettingsLine />, text: "Technology" },
    { icon: <FaBook />, text: "Education" },
    { icon: <FaLeaf />, text: "Agriculture" },
    { icon: <MdOutlineSportsBasketball />, text: "Sports" },
    { icon: <AiTwotoneMedicineBox />, text: "Medicine" },
  ];

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };
  const selectSlide = (index) => {
    setCurrentIndex(index);
  };
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Fetch campaigns from the API
    axios
      .get("http://161.35.19.77:8001/api/catalog/campaigns/")
      .then((response) => {
        setCampaigns(response.data); // Assuming response data is an array of campaigns
      })
      .catch((error) => {
        console.error("There was an error fetching the campaigns!", error);
      });
  }, []);
  return (
    <section className={styles.dashboard_wrapper}>
      <Navbar />
      <div className={styles.wrapper_campaign}>
        <h1>
          Bring <span className={styles.highlight_purple}>creative</span> <br />
          projects <span className={styles.highlight_green}>to life</span>
        </h1>
        <div className={styles.category}>
          <div className={styles.products}>
            <div className={styles.carousel}>
              <button className={styles.carouselControl} onClick={prevSlide}>
                &lt;
              </button>
              <div className={styles.carouselItems}>
                {carouselItems.map((item, index) => (
                  <div
                    className={`${styles.carouselItem} ${
                      index === currentIndex ? styles.active : ""
                    }`}
                    key={index}
                    onClick={() => selectSlide(index)}
                  >
                    {item.icon}
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
              <button className={styles.carouselControl} onClick={nextSlide}>
                &gt;
              </button>
            </div>
            <div className={styles.container}>
              {campaigns.map((campaign) => (
                <div key={campaign.id} className={styles.campaignCard}>
                  <div className={styles.image}>
                    {/* Assuming the image URL is in campaign.image */}
                    <img
                      src={campaign.image}
                      alt={campaign.name}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  {campaign.trending && (
                    <div className={styles.trending}>Trending this week</div>
                  )}
                  <div className={styles.title}>{campaign.name}</div>
                  <div className={styles.funding}>
                    {campaign.funding}% funded
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className={styles.aside_filter}>
            <div className={styles.filtersContainer}>
              <h3 className={styles.filterHeader}>Filters</h3>

              <div className={styles.filterSection}>
                <h4>Sort by:</h4>
                {renderRadioGroup(
                  "sortBy",
                  [
                    { value: "newest", label: "Newest" },
                    { value: "endDate", label: "End date" },
                    { value: "mostFunded", label: "Most Funded" },
                    { value: "mostBacked", label: "Most Backed" },
                    { value: "mostPopular", label: "Most Popular" },
                  ],
                  sortBy,
                  setSortBy
                )}
              </div>

              <div className={styles.filterSection}>
                <h4>Raised amount:</h4>
                {renderRadioGroup(
                  "raisedAmount",
                  [
                    { value: "<10mln", label: "<10 mln uzs" },
                    { value: "10-100mln", label: "10 mln - 100 mln uzs" },
                    { value: "100-500mln", label: "100 mln - 500 mln uzs" },
                    { value: ">500mln", label: ">500 mln uzs" },
                  ],
                  raisedAmount,
                  setRaisedAmount
                )}
              </div>

              <div className={styles.filterSection}>
                <h4>Goal amount:</h4>
                {renderRadioGroup(
                  "goalAmount",
                  [
                    { value: "<10mln", label: "<10 mln uzs" },
                    { value: "10-100mln", label: "10 mln - 100 mln uzs" },
                    { value: "100-500mln", label: "100 mln - 500 mln uzs" },
                    { value: ">500mln", label: ">500 mln uzs" },
                  ],
                  goalAmount,
                  setGoalAmount
                )}
              </div>

              <div className={styles.filterSection}>
                <h4>Funding state:</h4>
                {renderRadioGroup(
                  "fundingState",
                  [
                    { value: "live", label: "Live" },
                    { value: "successful", label: "Successful" },
                    { value: "upcoming", label: "Upcoming" },
                  ],
                  fundingState,
                  setFundingState
                )}
              </div>

              <div className={styles.filterSection}>
                <h4>Currency:</h4>
                {renderRadioGroup(
                  "currency",
                  [
                    { value: "uzs", label: "UZS" },
                    { value: "usd", label: "USD" },
                  ],
                  currency,
                  setCurrency
                )}
              </div>

              <div className={styles.filterSection}>
                <h4>Project state:</h4>
                {renderRadioGroup(
                  "projectState",
                  [
                    { value: "production", label: "Production" },
                    { value: "prototype", label: "Prototype" },
                    { value: "concept", label: "Concept" },
                    { value: "launched", label: "Launched" },
                  ],
                  projectState,
                  setProjectState
                )}
              </div>

              <div className={styles.filterSection}>
                <h4>Raised %:</h4>
                {renderRadioGroup(
                  "raisedPercentage",
                  [
                    { value: "<75%", label: "< 75%" },
                    { value: "75%-100%", label: "75% - 100%" },
                    { value: ">100%", label: "> 100%" },
                  ],
                  raisedPercentage,
                  setRaisedPercentage
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CampaignDashboard;
