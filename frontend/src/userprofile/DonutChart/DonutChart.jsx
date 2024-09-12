import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import styles from "./DonutChart.module.scss";

// Custom hook to get window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const DonutChart = () => {
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [error, setError] = useState(null);
  const { width } = useWindowSize(); // Get window width

  useEffect(() => {
    const fetchCategoryBreakdown = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            "http://161.35.19.77:8001/api/investments/dashboard/category-breakdown/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (Array.isArray(response.data)) {
            const formattedData = response.data.map((item) => ({
              campaign_name: item.campaign_name,
              percentage: parseFloat(item.percentage),
            }));
            setCategoryBreakdown(formattedData);
          } else {
            throw new Error("Unexpected data format");
          }
        } else {
          setError("No token found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching category breakdown data:", error);
        setError("Failed to fetch data.");
      }
    };

    fetchCategoryBreakdown();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF6384",
    "#36A2EB",
  ];

  // Dynamic chart size based on window width
  const chartWidth = width > 600 ? width * 0.8 : width * 0.9; // Adjust width
  const chartHeight = width > 600 ? width * 0.6 : width * 0.7; // Adjust height

  return (
    <div className={styles.donutChart}>
      <h1>Investment Categories</h1>
      {error ? (
        <p>{error}</p>
      ) : categoryBreakdown.length > 0 ? (
        <PieChart width={chartWidth} height={chartHeight}>
          <Pie
            data={categoryBreakdown}
            dataKey="percentage"
            nameKey="campaign_name"
            cx="50%"
            cy="50%"
            outerRadius={chartWidth / 3} // Dynamic outer radius
            innerRadius={chartWidth / 6} // Dynamic inner radius
          >
            {categoryBreakdown.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>No data available for the donut chart.</p>
      )}
    </div>
  );
};

export default DonutChart;
