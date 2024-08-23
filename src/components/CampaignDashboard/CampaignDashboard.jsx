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
import CampaignsFilters from "../../components/CampaignFilters/CampaignFilters";
import CampaignGrid from "../../components/CampaignGrid/CampaignGrid";

const CampaignDashboard = () => {
  const [filters, setFilters] = useState({
    sort: "newest",
    goal_amount: "",
    funding_status: "",
    project_state: "",
    raised_percentage: "",
  });

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

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
            <CampaignGrid />
          </div>
          <AsideDashboard filters={filters} />
        </div>
      </div>
    </section>
  );
};

export default CampaignDashboard;
