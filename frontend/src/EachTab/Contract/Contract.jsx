import React, { useState } from "react";
import axios from "axios";
import styles from "./Contract.module.scss"; // Import CSS module for styling

const Contract = ({ campaignId }) => {
  const [contractFields, setContractFields] = useState({
    investment_type: "equity", // Default to equity
    valuation_cap: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContractFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      investment_type: contractFields.investment_type,
      valuation_cap: parseFloat(
        contractFields.valuation_cap.replace(/[^0-9.]/g, "")
      ),
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
      setSuccessMessage("Campaign contract updated successfully!");
    } catch (error) {
      console.error(
        "Error updating contract:",
        error.response?.data || error.message
      );
      setErrorMessage("Failed to update contract. Please try again.");
    }
  };

  return (
    <div className={styles.contractFormContainer}>
      <h1>Contract</h1>

      <form onSubmit={handleSubmit} className={styles.contractForm}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Choose an investment contract
          </label>

          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="investment_type"
                value="equity"
                checked={contractFields.investment_type === "equity"}
                onChange={handleInputChange}
              />
              <span className={styles.radioCustom}></span>
              <p>Equity based fundraising</p>
            </label>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="investment_type"
                value="donation"
                checked={contractFields.investment_type === "donation"}
                onChange={handleInputChange}
              />
              <span className={styles.radioCustom}></span>
              <p>Donations</p>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            What is your valuation cap?
          </label>
          <p className={styles.description}>
            Valuation cap in equity-based crowdfunding sets a maximum company
            valuation at which convertible debt or notes will convert into
            equity during a future financing round.
          </p>

          <div className={styles.valuationCapInput}>
            <span className={styles.dollarSign}>$</span>
            <input
              type="text"
              name="valuation_cap"
              value={contractFields.valuation_cap}
              onChange={handleInputChange}
              placeholder="0"
              required
              className={styles.inputField}
            />
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

export default Contract;
