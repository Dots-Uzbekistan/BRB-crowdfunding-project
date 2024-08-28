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

    // Attach event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial call to set document height
    handleResize();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate the scroll percentage
  const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  return (
    <div className={styles.scrollIndicatorWrapper}>
      <div
        className={styles.scrollIndicator}
        style={{
          width: `${scrollPercentage}%`,
        }}
      />
    </div>
  );
};

export default ScrollIndicator;
