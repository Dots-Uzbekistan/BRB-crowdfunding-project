import React from "react";
import { motion } from "framer-motion";
import styles from "./FooterMini.module.scss";

const FooterMini = () => {
  return (
    <div className={styles.footer_mini}>
      <motion.svg
        width="75"
        height="17"
        viewBox="0 0 75 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <circle cx="8.4753" cy="8.4753" r="8.4753" fill="black" />
        <circle cx="25.9939" cy="8.4753" r="8.4753" fill="black" />
        <circle cx="43.5114" cy="8.4753" r="8.4753" fill="black" />
        <circle cx="66.5241" cy="8.4753" r="8.4753" fill="black" />
      </motion.svg>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Created by Dots
      </motion.p>
    </div>
  );
};

export default FooterMini;
