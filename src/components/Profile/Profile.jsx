import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Profile.module.scss";
import Navbar from "../Navbar/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    surname: "",
  });

  useEffect(() => {
    axios
      .get("http://161.35.19.77:8001/api/users/profile/")
      .then((response) => {
        const data = response.data;
        setProfile({
          username: data.username,
          name: data.name,
          surname: data.surname,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the profile data:", error);
      });
  }, []);

  return (
    <section className={styles.wrapper_profile}>
      <Navbar />
      <div className={styles.investmentPage}>
        <div className={styles.profileInfo}>
          <div className={styles.profileText}>
            <p>{profile.username}</p>
            <p>
              {profile.name} {profile.surname}
            </p>
          </div>
          <div className={styles.profileAvatar}>
            <img src="path_to_avatar_image" alt="Profile Avatar" />
          </div>
        </div>
        <h2>My investments</h2>
        <div className={styles.investments}>
          <div className={styles.investmentCard}>
            <p>86% raised</p>
            <p>10 days left</p>
            <p>Your equity 4%</p>
            <h3>Raised $13.4K</h3>
          </div>
          <div className={styles.investmentCard}>
            <p>94% raised</p>
            <p>23 days left</p>
            <p>Your equity 2%</p>
            <h3>Raised $21.4K</h3>
          </div>
          <div className={styles.investmentCard}>
            <p>16% raised</p>
            <p>42 days left</p>
            <p>Your equity 11%</p>
            <h3>Raised $3.7K</h3>
          </div>
          <div className={styles.investmentCard}>
            <p>4% raised</p>
            <p>63 days left</p>
            <p>Your equity 13%</p>
            <h3>Raised $1.6K</h3>
          </div>
        </div>
        <div className={styles.donutChart}>
          <img src="path_to_donut_chart_image" alt="Donut Chart" />
        </div>
      </div>
    </section>
  );
};

export default Profile;
