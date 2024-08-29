import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./ViewRateChart.module.scss";

const ViewsRateChart = () => {
  const [viewsData, setViewsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViewsRate = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            "http://161.35.19.77:8001/api/investments/dashboard/views-rate/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("API Response:", response.data);

          if (Array.isArray(response.data)) {
            const formattedData = response.data
              .map((item) => {
                const monthlyViews = Object.entries(item.monthly_views).map(
                  ([month, views]) => ({
                    month,
                    views,
                    campaign: item.campaign_name,
                  })
                );
                return monthlyViews;
              })
              .flat();

            setViewsData(formattedData);
          } else {
            throw new Error("Unexpected data format");
          }
        } else {
          setError("No token found. Please log in.");
        }
      } catch (error) {
        console.error(
          "There was an error fetching the views rate data:",
          error
        );
        setError("Failed to fetch views rate data.");
      }
    };

    fetchViewsRate();
  }, []);

  return (
    <div className={styles.viewsRateChart}>
      {error ? (
        <p>{error}</p>
      ) : viewsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={viewsData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p>No data for the views rate chart.</p>
      )}
    </div>
  );
};

export default ViewsRateChart;
