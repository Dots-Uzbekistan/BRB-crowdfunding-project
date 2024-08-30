import React, { useState } from "react";
import styles from "./CampaignDashboard.module.scss";
import Navbar from "../Navbar/Navbar";
import { FaPen } from "react-icons/fa";
import { RiSettingsLine } from "react-icons/ri";
import { FaBook } from "react-icons/fa6";
import { FaLeaf } from "react-icons/fa";
import { MdOutlineSportsBasketball } from "react-icons/md";
import { AiTwotoneMedicineBox } from "react-icons/ai";
import { RiAlignItemBottomLine } from "react-icons/ri";
import AsideDashboard from "../../subcomponents/AsideDashboard/AsideDashboard";
import CampaignGrid from "../../components/CampaignGrid/CampaignGrid";
import SavedCampaigns from "../../subcomponents/SavedCampaigns/SavedCampaigns";
import LastVisitedCampaigns from "../LastVisitedCampaigns/LastVisitedCampaigns";
import Footer from "../Footer/Footer";

const CampaignDashboard = () => {
  const [filters, setFilters] = useState({
    sort: "newest",
    goal_amount: "",
    funding_status: "",
    project_state: "",
    raised_percentage: "",
    project_category: "",
  });

  const handleApplyFilters = (newFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselItems = [
    { icon: <RiAlignItemBottomLine />, text: "All", category: "All" },
    { icon: <FaPen />, text: "Art & Crafts", category: "art" },
    { icon: <RiSettingsLine />, text: "Technology", category: "technology" },
    { icon: <FaBook />, text: "Education", category: "education" },
    { icon: <FaLeaf />, text: "Agriculture", category: "agriculture" },
    { icon: <MdOutlineSportsBasketball />, text: "Sports", category: "sports" },
    { icon: <AiTwotoneMedicineBox />, text: "Medicine", category: "medicine" },
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
    handleApplyFilters({ project_category: carouselItems[index].category });
    console.log("Selected category:", carouselItems[index].category); // Debugging
  };

  // const handleDeselectCategory = () => {
  //   handleApplyFilters({ project_category: "" });
  //   console.log("Deselected category");
  // };

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
                    <span>{item.icon}</span>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
              <button className={styles.carouselControl} onClick={nextSlide}>
                &gt;
              </button>
            </div>

            <CampaignGrid filters={filters} />
          </div>
          <AsideDashboard onApplyFilters={handleApplyFilters} />
        </div>
        <LastVisitedCampaigns />
        <SavedCampaigns />
      </div>
      <Footer />
    </section>
  );
};

export default CampaignDashboard;
