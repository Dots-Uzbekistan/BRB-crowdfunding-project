import React, { useEffect, useState } from "react";
import styles from "./ScrollIndicator.module.scss";
const ScrollIndicator = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [docHeight, setDocHeight] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    const handleResize = () => {
      setDocHeight(document.documentElement.scrollHeight - window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set docHeight

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const scrollPercentage = (scrollTop / docHeight) * 100;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "5px",
        backgroundColor: "#ddd",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: `${scrollPercentage}%`,
          height: "100%",
          backgroundColor: "#4caf50",
          transition: "width 0.1s ease-out",
        }}
      />
    </div>
  );
};

export default ScrollIndicator;
