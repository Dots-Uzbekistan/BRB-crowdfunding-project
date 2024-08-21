import React from "react";
import styles from "./TermsConditions.module.scss";
import LoginNavbar from "../LoginNavbar/LoginNavbar";
import girl from "../../assets/girl.png";
import { Link } from "react-router-dom";
const TermsConditions = () => {
  return (
    <section>
      <LoginNavbar />
      <div className={styles.wrapper_conditions}>
        <div className={styles.description}>
          <h2>Step 1</h2>
          <h3>Let's set up your investor account</h3>
          <p>
            By continuing, you agree to the Terms, Privacy Policy, Investor
            Agreement, Electronic Delivery of Documents, and Disclosures
          </p>
        </div>
        <div className={styles.right}>
          <img src={girl} alt="" className={styles.image_girl} />
          <Link to={"fullregisteration"}>
            <button className={styles.btn}>Next</button>
          </Link>
        </div>
      </div>
      <div className={styles.line}>
        <div className={styles.active}></div>
        <div className={styles.notactive}></div>
      </div>
    </section>
  );
};

export default TermsConditions;
