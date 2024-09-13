import React from "react";
import { motion } from "framer-motion";
import styles from "./Kickstarterad.module.scss";

const Kickstarterad = () => {
  return (
    <motion.div
      className={styles.wrapper_ad}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        We are back
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        The <span>MOST</span> successful furniture <br />
        KickStarter in history
      </motion.p>
    </motion.div>
  );
};

export default Kickstarterad;
