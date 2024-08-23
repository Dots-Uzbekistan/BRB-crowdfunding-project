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
import AsideDashboard from "../../subcomponents/AsideDashboard/AsideDashboard";

const CampaignDashboard = () => {
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
      .get("http://161.35.19.77:8001/api/catalog/campaigns")
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
          <AsideDashboard />
        </div>
      </div>
    </section>
  );
};

export default CampaignDashboard;
