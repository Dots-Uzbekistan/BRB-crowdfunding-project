import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Registration.module.scss";
import money from "../../assets/money.png";
import laptop from "../../assets/laptop.png";

const Registration = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    localStorage.setItem("selectedRole", role);
  };

  return (
    <section className={styles.registration}>
      <motion.div
        className={styles.wrapper_register}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Who are you?
        </motion.h1>

        <div className={styles.selection_role}>
          <motion.article
            className={`${styles.role_investor} ${
              selectedRole === "investor" ? styles.selected : ""
            }`}
            onClick={() => handleRoleSelection("investor")}
            whileHover={{ scale: 1.05 }}
          >
            <img src={money} alt="Investor" />
            <p>Investor</p>
          </motion.article>

          <motion.article
            className={`${styles.role_creator} ${
              selectedRole === "creator" ? styles.selected : ""
            }`}
            onClick={() => handleRoleSelection("creator")}
            whileHover={{ scale: 1.05 }}
          >
            <img src={laptop} alt="Creator" />
            <p>Founder</p>
          </motion.article>
        </div>

        <motion.button
          className={styles.btn_register}
          whileHover={{ scale: 1.1, gap: "2rem" }}
        >
          <Link to={"/lastregistration"} className={styles.fullregister}>
            Next
          </Link>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className={styles.login_here}
        >
          Already have an account?{" "}
          <Link className={styles.link_register} to={"/login"}>
            Log in here
          </Link>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Registration;
