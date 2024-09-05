import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import styles from "./DonutChart.module.scss";

const DonutChart = () => {
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className={styles.donutChart}>
      <h1>Investment Categories</h1>
      {error ? (
        <p>{error}</p>
      ) : categoryBreakdown.length > 0 ? (
        <PieChart width={500} height={550}>
          <Pie
            data={categoryBreakdown}
            dataKey="percentage"
            nameKey="campaign_name"
            cx="50%"
            cy="50%"
            outerRadius={200}
            innerRadius={80}
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
