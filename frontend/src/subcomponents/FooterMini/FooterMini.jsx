import React from "react";
import styles from "./FooterMini.module.scss";
const FooterMini = () => {
  return (
    <div className={styles.footer_mini}>
      <svg
        width="75"
        height="17"
        viewBox="0 0 75 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8.4753" cy="8.4753" r="8.4753" fill="black" />
        <circle cx="25.9939" cy="8.4753" r="8.4753" fill="black" />
        <circle cx="43.5114" cy="8.4753" r="8.4753" fill="black" />
        <circle cx="66.5241" cy="8.4753" r="8.4753" fill="black" />
      </svg>
      <p>Created by Dots</p>
    </div>
  );
};

export default FooterMini;
