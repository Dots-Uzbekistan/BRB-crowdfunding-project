import React from "react";
import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const token = localStorage.getItem("token");

  return (
    <section className={styles.footer}>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={styles.heading1}
      >
        Get Started
      </motion.h1>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={styles.heading2}
      >
        Invest in the founders, products, and missions you love and raise money
        for the project of your life
      </motion.h2>
      {token ? (
        <motion.button
          className={styles.button_signup}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <h3>Explore</h3>
          <svg
            width="27"
            height="27"
            viewBox="0 0 31 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.102783 0.210393H11.8064L30.4996 18.6598L11.8064 37.1092H0.102783L18.8773 18.6598L0.102783 0.210393Z"
              fill="black"
            />
          </svg>
        </motion.button>
      ) : (
        <>
          <motion.button
            className={styles.button_signup}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <h3>Sign up</h3>
            <svg
              width="27"
              height="27"
              viewBox="0 0 31 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.102783 0.210393H11.8064L30.4996 18.6598L11.8064 37.1092H0.102783L18.8773 18.6598L0.102783 0.210393Z"
                fill="black"
              />
            </svg>
          </motion.button>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={styles.infoText}
          >
            Already have an account?{" "}
            <Link className={styles.link_footer}>Log in here</Link>
          </motion.p>
        </>
      )}
      <motion.div
        className={styles.logo_wrapper_dots}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <svg
          width="45"
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
        <p className={styles.logoText}>created by Dots</p>
      </motion.div>
    </section>
  );
};

export default Footer;
