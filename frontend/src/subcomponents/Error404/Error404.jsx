// Error404.jsx

import React from "react";
import { motion } from "framer-motion";
import styles from "./Error404.module.scss";

const Error404 = () => {
  return (
    <div className={styles.errorContainer}>
      <motion.div
        className={styles.errorMessage}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.div>
      <motion.div
        className={styles.errorDescription}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Oops! Page not found.
      </motion.div>
      <motion.a
        href="/"
        className={styles.homeLink}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        Go back to Home
      </motion.a>
    </div>
  );
};

export default Error404;
