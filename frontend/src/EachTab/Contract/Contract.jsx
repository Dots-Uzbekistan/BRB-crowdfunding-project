import React, { useState } from "react";
import axios from "axios";
import styles from "./Contract.module.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contract = ({ campaignId, onComplete }) => {
  const [contractFields, setContractFields] = useState({
    investment_type: "equity",
    valuation_cap: "",
  });

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

    const formattedValuationCap = parseFloat(
      contractFields.valuation_cap.replace(/[^0-9.]/g, "")
    );

    if (isNaN(formattedValuationCap)) {
      toast.error("Valuation cap must be a valid number.");
      return;
    }

    const payload = {
      investment_type: contractFields.investment_type,
      valuation_cap: formattedValuationCap,
    };

    try {
      const response = await axios.patch(
        `http://161.35.19.77:8001/api/founder/campaigns/${campaignId}/edit/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);
      toast.success("Campaign contract updated successfully!");
      if (onComplete) onComplete();
    } catch (error) {
      let errorMessage = "An unknown error occurred.";

      if (error.response) {
        if (error.response.headers["content-type"].includes("text/html")) {
          errorMessage = "Received unexpected HTML response from the server.";
        } else {
          errorMessage = error.response.data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      } else {
        errorMessage = error.message;
      }

      console.error("Error updating contract:", {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      toast.error(`Failed to update contract. ${errorMessage}`);
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
    </div>
  );
};

export default Contract;
