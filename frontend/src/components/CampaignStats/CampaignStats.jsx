import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./CampaignStats.module.scss";
import { ThreeDots } from "react-loader-spinner";

const CampaignStats = () => {
  const { campaignId } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      if (!campaignId) {
        setError("Invalid campaign ID");
        return;
      }

      try {
        const response = await axios.get(
          `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/dashboard-stats/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : "An error occurred");
      }
    };

    fetchStats();
  }, [campaignId]);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!stats) {
    return (
      <div className={styles.loading}>
        <ThreeDots color="#4fa94d" height={80} width={80} />
      </div>
    );
  }

  const visitsData = stats.campaign_visits_rate.labels.map((label, index) => ({
    month: label,
    visits: stats.campaign_visits_rate.data[index],
  }));

  const savesData = stats.campaign_saves_rate.labels.map((label, index) => ({
    month: label,
    saves: stats.campaign_saves_rate.data[index],
  }));

  // Handle days_left
  const daysLeft = stats.days_left !== undefined ? stats.days_left : "N/A";

  return (
    <div>
      <Navbar />
      <motion.div
        className={styles.wrapper_stats_campaign}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Total Raised Funds</h3>
            <p>${stats.total_raised_funds}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Visits</h3>
            <p>{stats.total_visits}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Investors</h3>
            <p>{stats.total_investors}</p>
          </div>
        </div>

        <div className={styles.chart}>
          <h3>Campaign Page Visits Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={visitsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#4fa94d"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Total Likes</h3>
            <p>{stats.total_likes}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Shares</h3>
            <p>{stats.total_shares}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Saves</h3>
            <p>{stats.total_saves}</p>
          </div>
        </div>

        <div className={styles.chart}>
          <h3>Campaign Page Saves Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={savesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="saves"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Days Left</h3>
            <p>{daysLeft}</p>
          </div>
          <div className={styles.card}>
            <h3>Goal Raised</h3>
            <p>{stats.percent_raised}%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignStats;
