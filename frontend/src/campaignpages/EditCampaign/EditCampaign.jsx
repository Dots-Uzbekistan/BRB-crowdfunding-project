import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import Tabs from "../Tabs/Tabs";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./EditCampaign.module.scss";
import { FaChevronLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";

const EditCampaign = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [registrationSteps, setRegistrationSteps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaignAndSteps = async () => {
      const token = localStorage.getItem("token");

      try {
        const campaignResponse = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCampaign(campaignResponse.data);

        const stepsResponse = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${id}/registration-steps/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRegistrationSteps(stepsResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/", { replace: true });
        } else {
          setError("Error fetching campaign details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignAndSteps();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={styles.loader}>
        <ThreeDots color="#4fa94d" height={80} width={80} />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <motion.div
      className={styles.wrapper_edit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <div className={styles.nav_edit}>
        <Link to={"/fulldashboard"} className={styles.back}>
          <FaChevronLeft />
          <p>Back</p>
        </Link>
        <h1>Edit Campaign</h1>
      </div>
      <Tabs campaign={campaign} registrationSteps={registrationSteps} />
    </motion.div>
  );
};

export default EditCampaign;
