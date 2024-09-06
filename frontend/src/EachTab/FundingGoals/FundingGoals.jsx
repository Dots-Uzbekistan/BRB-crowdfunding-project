import React, { useState } from "react";
import axios from "axios";
import styles from "./FundingGoals.module.scss"; // Import CSS module for styling

const FundingGoals = ({ campaignId }) => {
  const [fundingFields, setFundingFields] = useState({
    goal_amount: "",
    max_goal_amount: "",
    deadline_day: "",
    deadline_month: "",
    deadline_year: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFundingFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      goal_amount: parseInt(fundingFields.goal_amount, 10),
      max_goal_amount: parseInt(fundingFields.max_goal_amount, 10),
      deadline: `${
        fundingFields.deadline_year
      }-${fundingFields.deadline_month.padStart(
        2,
        "0"
      )}-${fundingFields.deadline_day.padStart(2, "0")}`,
    };

    try {
      await axios.patch(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/edit/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Funding goals updated successfully!");
    } catch (error) {
      console.error(
        "Error updating funding goals:",
        error.response?.data || error.message
      );
      setErrorMessage("Failed to update funding goals. Please try again.");
    }
  };

  return (
    <div className={styles.fundingGoalsContainer}>
      <h1>Update Funding Goals</h1>

      <form onSubmit={handleSubmit} className={styles.fundingGoalsForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Minimum Raise ($)</label>
          <input
            type="number"
            name="goal_amount"
            value={fundingFields.goal_amount}
            onChange={handleInputChange}
            placeholder="Enter minimum raise"
            required
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Maximum Raise ($)</label>
          <input
            type="number"
            name="max_goal_amount"
            value={fundingFields.max_goal_amount}
            onChange={handleInputChange}
            placeholder="Enter maximum raise"
            required
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Deadline</label>
          <div className={styles.dateFields}>
            <select
              name="deadline_day"
              value={fundingFields.deadline_day}
              onChange={handleInputChange}
              required
              className={styles.dateSelect}
            >
              <option value="">Day</option>
              {[...Array(31).keys()].map((d) => (
                <option key={d + 1} value={d + 1}>
                  {d + 1}
                </option>
              ))}
            </select>
            <select
              name="deadline_month"
              value={fundingFields.deadline_month}
              onChange={handleInputChange}
              required
              className={styles.dateSelect}
            >
              <option value="">Month</option>
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>
                  {m + 1}
                </option>
              ))}
            </select>
            <select
              name="deadline_year"
              value={fundingFields.deadline_year}
              onChange={handleInputChange}
              required
              className={styles.dateSelect}
            >
              <option value="">Year</option>
              {[...Array(10).keys()].map((y) => (
                <option key={2024 + y} value={2024 + y}>
                  {2024 + y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
      </form>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default FundingGoals;
