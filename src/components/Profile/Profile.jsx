import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Profile.module.scss";
import Navbar from "../Navbar/Navbar";
import { FaUserCircle } from "react-icons/fa";
import DonutChart from "../../userprofile/DonutChart/DonutChart";
import InvestmentList from "../../userprofile/InvestmentList/InvestmentList";
import { ThreeDots } from "react-loader-spinner";
import ViewsRateChart from "../../userprofile/ViewRateChart/ViewRateChart";
import SavedCampaigns from "../../subcomponents/SavedCampaigns/SavedCampaigns";
import ProfileMiniDashboard from "../../userprofile/ProfileMiniDashboard/ProfileMiniDashboard";
import TransactionHistory from "../../userprofile/TransactionHistory/TransactionHistory";
import FooterMini from "../../subcomponents/FooterMini/FooterMini";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    profile_image: "",
    surname: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("http://161.35.19.77:8001/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setProfile({
            username: data.username,
            name: data.name,
            profile_image: data.profile_image,
            surname: data.surname,
          });
        })
        .catch((error) => {
          console.error("There was an error fetching the profile data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("No token found. Please log in.");
      setLoading(false);
    }
  }, []);

  return (
    <section className={styles.wrapper_profile}>
      <Navbar />
      {loading ? (
        <div className={styles.loaderContainer}>
          <ThreeDots
            height="100"
            width="100"
            radius="9"
            color="#4fa94d"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <div className={styles.investmentPage}>
          <div className={styles.title_profile_section}>
            <h2>My investments</h2>
            <div className={styles.profileInfo}>
              <div className={styles.profileAvatar}>
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt="Profile Avatar"
                    className={styles.avatarImage}
                  />
                ) : (
                  <FaUserCircle className={styles.avatarIcon} size={50} />
                )}
              </div>
              <div className={styles.profileText}>
                <h3>{profile.username}</h3>
                <h4>
                  {profile.name} {profile.surname}
                </h4>
              </div>
            </div>
          </div>
          <div className={styles.chart_investments}>
            <InvestmentList />
            <DonutChart />
          </div>
          <ViewsRateChart />
          <ProfileMiniDashboard />
          <TransactionHistory />
          <SavedCampaigns />
          <FooterMini />
        </div>
      )}
    </section>
  );
};

export default Profile;
