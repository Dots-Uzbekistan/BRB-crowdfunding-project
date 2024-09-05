import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Tabs from "../Tabs/Tabs";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./EditCampaign.module.scss";
import { FaChevronLeft } from "react-icons/fa";

const EditCampaign = () => {
  const { id } = useParams(); // Get campaign ID from URL
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://161.35.19.77:8001/api/founder/campaigns/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCampaign(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching campaign details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className={styles.wrapper_edit}>
        <div className={styles.nav_edit}>
          <Link to={"/fulldashboard"} className={styles.back}>
            <FaChevronLeft />
            <p>Back</p>
          </Link>
          <h1>Edit Campaign</h1>
        </div>
        <Tabs campaignId={id} />
      </div>
    </div>
  );
};

export default EditCampaign;
