import React, { useState, useEffect } from "react";
import styles from "./CampaignDashboard.module.scss";
import Navbar from "../Navbar/Navbar";
import { FaPen } from "react-icons/fa";
import { RiSettingsLine } from "react-icons/ri";
import { FaBook } from "react-icons/fa6";
import { FaLeaf } from "react-icons/fa";
import { MdOutlineSportsBasketball } from "react-icons/md";
import { AiTwotoneMedicineBox } from "react-icons/ai";
import { RiAlignItemBottomLine } from "react-icons/ri";
import { MdAirlineStops } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

import AsideDashboard from "../../subcomponents/AsideDashboard/AsideDashboard";
import CampaignGrid from "../../components/CampaignGrid/CampaignGrid";
import SavedCampaigns from "../../subcomponents/SavedCampaigns/SavedCampaigns";
import FooterMini from "../../subcomponents/FooterMini/FooterMini";

const CampaignDashboard = () => {
  const [filters, setFilters] = useState({
    sort: "newest",
    goal_amount: "",
    funding_status: "",
    project_state: "",
    raised_percentage: "",
    project_category: "",
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const carouselItems = [
    { icon: <RiAlignItemBottomLine />, text: "All", category: "" },
    { icon: <FaPen />, text: "Art", category: "art" },
    { icon: <RiSettingsLine />, text: "Tech", category: "tech" },
    { icon: <FaBook />, text: "Education", category: "education" },
    { icon: <FaLeaf />, text: "Nature", category: "nature" },
    { icon: <GiHealthNormal />, text: "Healthcare", category: "healthcare" },
    { icon: <MdAirlineStops />, text: "Fintech", category: "fintech" },
    { icon: <AiTwotoneMedicineBox />, text: "Fashion", category: "fashion" },
    { icon: <MdOutlineSportsBasketball />, text: "Others", category: "others" },
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
    console.log("Selected category:", carouselItems[index].category);
  };

  const handleDeselectCategory = () => {
    setCurrentIndex(0);
    handleApplyFilters({ project_category: "" });
    console.log("Deselected category");
  };

  const handleApplyFilters = (newFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDropdownChange = (e) => {
    const index = carouselItems.findIndex(
      (item) => item.category === e.target.value
    );
    selectSlide(index);
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia("(max-width: 1110px)").matches;
      setIsButtonVisible(isMobile);
      setIsDropdownVisible(isMobile);
      if (!isMobile) {
        setIsModalVisible(false);
        setIsDropdownVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
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
            {isDropdownVisible ? (
              <div className={styles.dropdown}>
                <h2>Select category</h2>
                <select
                  value={carouselItems[currentIndex].category}
                  onChange={handleDropdownChange}
                >
                  {carouselItems.map((item, index) => (
                    <option key={index} value={item.category}>
                      {item.text}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className={styles.carousel}>
                <button
                  className={`${styles.carouselControl} ${styles.prev}`}
                  onClick={prevSlide}
                >
                  &lt;
                </button>
                <div className={styles.carouselItems}>
                  {carouselItems.map((item, index) => (
                    <motion.div
                      className={`${styles.carouselItem} ${
                        index === currentIndex ? styles.active : ""
                      }`}
                      key={index}
                      onClick={() => selectSlide(index)}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                      <p>{item.text}</p>
                    </motion.div>
                  ))}
                </div>
                <button
                  className={`${styles.carouselControl} ${styles.next}`}
                  onClick={nextSlide}
                >
                  &gt;
                </button>
              </div>
            )}

            <CampaignGrid
              filters={filters}
              currentCategory={filters.project_category}
            />
          </div>

          <AnimatePresence>
            {isModalVisible && (
              <motion.div
                className={styles.modal}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className={styles.closeModal}
                  onClick={handleCloseModal}
                >
                  &times;
                </button>
                <AsideDashboard onApplyFilters={handleApplyFilters} />
              </motion.div>
            )}
          </AnimatePresence>

          {!isModalVisible && (
            <div className={styles.asideContainer}>
              <AsideDashboard onApplyFilters={handleApplyFilters} />
            </div>
          )}

          {isButtonVisible && !isModalVisible && (
            <button
              className={styles.openModalButton}
              onClick={handleOpenModal}
            >
              Open Filters
            </button>
          )}
        </div>
        <SavedCampaigns />
      </div>
      <FooterMini />
    </section>
  );
};

export default CampaignDashboard;
