import React, { useEffect, useState } from "react";
import styles from "./ScrollIndicator.module.scss";

const ScrollIndicator = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const scrollProgress = (scrollTop / docHeight) * 100;

          setScrollPercentage(scrollProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;

      setScrollPercentage(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    handleResize(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
