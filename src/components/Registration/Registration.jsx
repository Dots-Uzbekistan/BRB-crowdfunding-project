import React, { useState } from "react";
import styles from "./Registration.module.scss";
import LoginNavbar from "../../subcomponents/LoginNavbar/LoginNavbar";
import money from "../../assets/money.png";
import laptop from "../../assets/laptop.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Registration = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <section className={styles.registration}>
      <LoginNavbar />
      <div className={styles.wrapper_register}>
        <h1>Who are you ?</h1>
        <div className={styles.selection_role}>
          <article
            className={`${styles.role_investor} ${
              selectedRole === "investor" ? styles.selected : ""
            }`}
            onClick={() => setSelectedRole("investor")}
          >
            <img src={money} alt="Investor" />
            <p>Investor</p>
          </article>
          <article
            className={`${styles.role_creator} ${
              selectedRole === "creator" ? styles.selected : ""
            }`}
            onClick={() => setSelectedRole("creator")}
          >
            <img src={laptop} alt="Creator" />
            <p>Creator</p>
          </article>
        </div>
        <button className={styles.btn_register}>
          <Link to={"/verifyidentity"} className={styles.fullregister}>
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
        </button>
        <p>
          Already have an account ?{" "}
          <Link className={styles.link_register} to={"/login"}>
            {" "}
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Registration;
