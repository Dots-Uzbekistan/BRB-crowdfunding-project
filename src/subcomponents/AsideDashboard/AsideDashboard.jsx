import React, { useState } from "react";
import styles from "./AsideDashboard.module.scss";

const AsideDashboard = ({ onApplyFilters }) => {
  const [sortBy, setSortBy] = useState("");
  // const [raisedAmount, setRaisedAmount] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [fundingState, setFundingState] = useState("");
  // const [currency, setCurrency] = useState("");
  const [projectState, setProjectState] = useState("");
  const [raisedPercentage, setRaisedPercentage] = useState("");

  const renderRadioGroup = (name, options, selectedValue, setSelectedValue) => (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option.value} className={styles.radioOption}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => setSelectedValue(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );

  const handleApplyFilters = () => {
    onApplyFilters({
      sort: sortBy,
      goal_amount: goalAmount,
      funding_status: fundingState,
      project_state: projectState,
      raised_percentage: raisedPercentage,
    });
  };

  return (
    <aside className={styles.aside_filter}>
      <div className={styles.filtersContainer}>
        <h3 className={styles.filterHeader}>Filters</h3>

        <div className={styles.filterSection}>
          <h4>Sort by:</h4>
          {renderRadioGroup(
            "sortBy",
            [
              { value: "newest", label: "Newest" },
              { value: "endDate", label: "End date" },
              { value: "mostFunded", label: "Most Funded" },
              { value: "mostBacked", label: "Most Backed" },
              { value: "mostPopular", label: "Most Popular" },
            ],
            sortBy,
            setSortBy
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Goal amount:</h4>
          {renderRadioGroup(
            "goalAmount",
            [
              { value: "<10mln", label: "<10 mln uzs" },
              { value: "10-100mln", label: "10 mln - 100 mln uzs" },
              { value: "100-500mln", label: "100 mln - 500 mln uzs" },
              { value: ">500mln", label: ">500 mln uzs" },
            ],
            goalAmount,
            setGoalAmount
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Funding state:</h4>
          {renderRadioGroup(
            "fundingState",
            [
              { value: "live", label: "Live" },
              { value: "successful", label: "Successful" },
              { value: "upcoming", label: "Upcoming" },
            ],
            fundingState,
            setFundingState
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Project state:</h4>
          {renderRadioGroup(
            "projectState",
            [
              { value: "production", label: "Production" },
              { value: "prototype", label: "Prototype" },
              { value: "concept", label: "Concept" },
              { value: "launched", label: "Launched" },
            ],
            projectState,
            setProjectState
          )}
        </div>

        <div className={styles.filterSection}>
          <h4>Raised %:</h4>
          {renderRadioGroup(
            "raisedPercentage",
            [
              { value: "<75%", label: "< 75%" },
              { value: "75%-100%", label: "75% - 100%" },
              { value: ">100%", label: "> 100%" },
            ],
            raisedPercentage,
            setRaisedPercentage
          )}
        </div>

        <button onClick={handleApplyFilters} className={styles.applyButton}>
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default AsideDashboard;
