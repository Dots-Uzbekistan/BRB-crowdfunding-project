import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import styles from "./DonutChart.module.scss";
import { ThreeDots } from "react-loader-spinner";

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

          console.log("API Response:", response.data);

          if (Array.isArray(response.data)) {
            const formattedData = response.data.map((item) => ({
              ...item,
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
        console.error(
          "There was an error fetching the category breakdown data:",
          error
        );
        setError("Failed to fetch category breakdown data.");
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

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  };

  return (
    <div className={styles.donutChart}>
      <h1>Investment categories:</h1>
      {error ? (
        <ThreeDots color="#A5FFB8" height={80} width={80} />
      ) : categoryBreakdown.length > 0 ? (
        <PieChart width={500} height={550}>
          <Pie
            data={categoryBreakdown}
            dataKey="percentage"
            nameKey="category_name"
            cx="50%"
            cy="50%"
            outerRadius={200}
            innerRadius={80}
            fill="#8884d8"
            label={renderCustomLabel}
            labelLine={false}
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
        <p>No data for the donut chart.</p>
      )}
    </div>
  );
};

export default DonutChart;
